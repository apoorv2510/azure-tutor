import { getTopicById } from '@/app/data/curriculum'

const SYSTEM_PROMPT = (topicContext: string) => `You are an expert Azure tutor helping a student prepare for AZ-900 and AZ-104 certification exams, with the goal of becoming an Azure Solutions Architect Expert.

Your style:
- Direct and clear — no fluff, no filler
- Use concrete examples and real-world analogies
- When explaining a concept, connect it to exam relevance
- Answer the question, then check understanding with a follow-up if appropriate
- Use markdown: headers, tables, bullet points, code blocks for CLI commands

Current topic: ${topicContext}

If asked something outside Azure scope, gently redirect back to Azure study.`

export async function POST(request: Request) {
  try {
    const { messages, topicId } = await request.json()

    let topicContext = 'General Azure study'
    if (topicId) {
      const topic = getTopicById(topicId)
      if (topic) {
        topicContext = `${topic.exam} — ${topic.title} (${topic.domain}, ${topic.weight} of exam)`
      }
    }

    const systemPrompt = SYSTEM_PROMPT(topicContext)

    const body = {
      model: 'openai',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content,
        })),
      ],
      stream: true,
      seed: 42,
    }

    const upstream = await fetch('https://text.pollinations.ai/openai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!upstream.ok) {
      const err = await upstream.text()
      return new Response(`AI error: ${err}`, { status: 500 })
    }

    // Pass the SSE stream straight through to the client,
    // but extract just the text delta from each chunk.
    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        const reader = upstream.body!.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            const data = line.slice(6).trim()
            if (data === '[DONE]') continue
            try {
              const json = JSON.parse(data)
              const delta = json.choices?.[0]?.delta?.content
              if (delta) controller.enqueue(encoder.encode(delta))
            } catch {
              // skip malformed chunk
            }
          }
        }
        controller.close()
      },
    })

    return new Response(readable, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('[chat route]', msg)
    return new Response(`Tutor error: ${msg}`, { status: 500 })
  }
}
