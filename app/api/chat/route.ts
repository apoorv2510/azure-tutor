import { getTopicById } from '@/app/data/curriculum'
import { NextRequest } from 'next/server'

// ── Rate limiting (in-memory, per serverless instance) ──────────────────────
const rateMap = new Map<string, { count: number; reset: number }>()
const RATE_LIMIT  = 20          // max requests per window per IP
const WINDOW_MS   = 60_000      // 1 minute window
const MAX_BODY_KB = 24          // max request body size
const MAX_MSG_LEN = 2_000       // max chars per message
const MAX_HISTORY = 20          // max messages in history

function getIP(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateMap.get(ip)
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + WINDOW_MS })
    return false
  }
  if (entry.count >= RATE_LIMIT) return true
  entry.count++
  return false
}

// ── System prompt ────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = (ctx: string) =>
  `You are an expert Azure tutor helping a student prepare for AZ-900 and AZ-104 certification exams.

Style: direct, concrete, exam-focused. Use markdown (headers, tables, code blocks).
Current topic: ${ctx}
Stay on Azure study topics. Keep answers concise but complete.`

// ── Route handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // 1. Rate limit
  const ip = getIP(req)
  if (isRateLimited(ip)) {
    return new Response('Rate limit exceeded. Please wait a minute.', { status: 429 })
  }

  // 2. Body size limit
  const contentLength = Number(req.headers.get('content-length') ?? 0)
  if (contentLength > MAX_BODY_KB * 1024) {
    return new Response('Request too large.', { status: 413 })
  }

  // 3. Parse + validate body
  let body: { messages?: unknown; topicId?: unknown }
  try {
    body = await req.json()
  } catch {
    return new Response('Invalid JSON.', { status: 400 })
  }

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return new Response('Missing messages.', { status: 400 })
  }

  // 4. Sanitize messages — enforce shape, truncate, cap history
  const raw = body.messages as unknown[]
  const messages = raw
    .slice(-MAX_HISTORY)
    .filter((m): m is { role: string; content: string } =>
      typeof m === 'object' && m !== null &&
      typeof (m as Record<string, unknown>).role === 'string' &&
      typeof (m as Record<string, unknown>).content === 'string'
    )
    .map(m => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: String(m.content).slice(0, MAX_MSG_LEN).replace(/<[^>]*>/g, ''), // strip any HTML tags
    }))

  if (messages.length === 0) {
    return new Response('No valid messages.', { status: 400 })
  }

  // 5. Build topic context
  let topicContext = 'General Azure study'
  if (typeof body.topicId === 'string') {
    const topic = getTopicById(body.topicId)
    if (topic) topicContext = `${topic.exam} — ${topic.title} (${topic.domain}, ${topic.weight} of exam)`
  }

  // 6. Call Pollinations AI (free, no key required)
  let upstream: Response
  try {
    upstream = await fetch('https://text.pollinations.ai/openai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'openai',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT(topicContext) },
          ...messages,
        ],
        stream: true,
      }),
    })
  } catch (err) {
    console.error('[chat] upstream fetch failed:', err)
    return new Response('AI service unavailable. Try again.', { status: 503 })
  }

  if (!upstream.ok) {
    const errText = await upstream.text().catch(() => '')
    console.error('[chat] upstream error:', upstream.status, errText)
    return new Response('AI service error. Try again.', { status: 502 })
  }

  // 7. Stream SSE → plain text deltas to client
  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      const reader = upstream.body!.getReader()
      const decoder = new TextDecoder()
      let buf = ''

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buf += decoder.decode(value, { stream: true })
          const lines = buf.split('\n')
          buf = lines.pop() ?? ''
          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            const data = line.slice(6).trim()
            if (data === '[DONE]') continue
            try {
              const chunk = JSON.parse(data)
              const delta = chunk.choices?.[0]?.delta?.content
              if (delta) controller.enqueue(encoder.encode(delta))
            } catch { /* skip malformed chunk */ }
          }
        }
      } finally {
        controller.close()
      }
    },
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-store',
    },
  })
}
