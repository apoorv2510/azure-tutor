import { GoogleGenerativeAI } from '@google/generative-ai'
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
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return new Response(
      "Gemini API key not configured. Add your key to .env.local — get a free key at https://aistudio.google.com/app/apikey",
      { status: 200 }
    )
  }

  try {
    const { messages, topicId } = await request.json()

    let topicContext = 'General Azure study'
    if (topicId) {
      const topic = getTopicById(topicId)
      if (topic) {
        topicContext = `${topic.exam} — ${topic.title} (${topic.domain}, ${topic.weight} of exam)`
      }
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: SYSTEM_PROMPT(topicContext),
    })

    // Convert messages to Gemini format
    const history = messages.slice(0, -1).map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))

    const lastMessage = messages[messages.length - 1].content
    const chat = model.startChat({ history })
    const result = await chat.sendMessageStream(lastMessage)

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.stream) {
          const text = chunk.text()
          if (text) controller.enqueue(encoder.encode(text))
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
