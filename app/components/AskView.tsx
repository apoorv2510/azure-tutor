'use client'
import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { Topic } from '@/app/data/curriculum'

type Message = { role: 'user' | 'assistant'; content: string }

type Props = {
  topic: Topic
  onBack: () => void
}

const STARTER_PROMPTS = [
  "Explain this with a real-world analogy",
  "What's the most common exam trap here?",
  "Give me a scenario-based question",
  "What's the difference between the similar services?",
  "Summarize the key points I must memorize",
]

export default function AskView({ topic, onBack }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (text: string) => {
    if (!text.trim() || loading) return
    const userMsg: Message = { role: 'user', content: text }
    const next = [...messages, userMsg]
    setMessages(next)
    setInput('')
    if (textareaRef.current) { textareaRef.current.style.height = 'auto' }
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next, topicId: topic.id }),
      })
      if (!res.ok) {
        const errText = await res.text()
        throw new Error(errText || `HTTP ${res.status}`)
      }
      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let streamed = ''
      setMessages(m => [...m, { role: 'assistant', content: '' }])
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        streamed += decoder.decode(value, { stream: true })
        setMessages(m => [...m.slice(0, -1), { role: 'assistant', content: streamed }])
      }
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : 'Unknown error'
      setMessages(m => [...m, { role: 'assistant', content: `⚠️ ${errMsg}` }])
    } finally {
      setLoading(false)
    }
  }

  const isAz900 = topic.exam === 'AZ-900'

  return (
    <div className="flex-1 flex flex-col h-full min-w-0">
      {/* Header — hidden on mobile (mobile bar is in page.tsx) */}
      <div className="hidden md:flex px-6 py-3 items-center justify-between shrink-0"
        style={{ background: 'rgba(8,12,20,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={onBack} className="text-sm text-slate-500 hover:text-white transition-colors shrink-0">← Back</button>
          <span style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>
          <span
            className={`text-xs font-mono font-semibold px-2 py-0.5 rounded-md shrink-0 ${isAz900 ? 'text-blue-300' : 'text-violet-300'}`}
            style={{ background: isAz900 ? 'rgba(59,130,246,0.12)' : 'rgba(139,92,246,0.12)' }}>
            {topic.exam}
          </span>
          <span className="text-sm font-medium text-white truncate">{topic.title}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-slate-500">AI Tutor</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full pb-10">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg mb-4 shadow-lg shadow-blue-900/40">
              AI
            </div>
            <p className="text-slate-400 text-sm mb-1 font-medium">AI Tutor — {topic.title}</p>
            <p className="text-slate-600 text-xs mb-8">Ask anything about this topic</p>
            <div className="grid grid-cols-1 gap-2 w-full max-w-sm">
              {STARTER_PROMPTS.map(p => (
                <button key={p} onClick={() => send(p)}
                  className="text-left text-xs px-4 py-3 rounded-xl text-slate-400 hover:text-white transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                  onMouseEnter={e => { e.currentTarget.style.border = '1px solid rgba(59,130,246,0.35)'; e.currentTarget.style.background = 'rgba(59,130,246,0.06)' }}
                  onMouseLeave={e => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-1 shadow-md shadow-blue-900/30">
                AI
              </div>
            )}
            <div className="max-w-[85%]">
              {msg.role === 'user' ? (
                <div className="px-4 py-3 rounded-2xl rounded-br-md text-sm text-white"
                  style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}>
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
              ) : (
                <div className="px-4 py-3 rounded-2xl rounded-bl-md"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="lesson-prose text-sm [&_h1]:text-base [&_h2]:text-sm [&_h2]:mt-4 [&_p]:text-slate-300 [&_li]:text-slate-300">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0 mt-1"
                style={{ background: 'rgba(255,255,255,0.1)' }}>
                U
              </div>
            )}
          </div>
        ))}

        {loading && messages[messages.length - 1]?.role !== 'assistant' && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-xl bg-blue-600 flex items-center justify-center text-xs font-bold shrink-0 text-white">AI</div>
            <div className="px-4 py-3 rounded-2xl rounded-bl-md flex gap-1 items-center"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {[0, 1, 2].map(i => (
                <span key={i} className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 px-4 pb-4">
        <div className="flex gap-2 items-end p-1.5 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input) } }}
            onInput={e => { const el = e.currentTarget; el.style.height = 'auto'; el.style.height = Math.min(el.scrollHeight, 120) + 'px' }}
            placeholder={`Ask about ${topic.title}…`}
            rows={1}
            className="flex-1 bg-transparent text-white text-sm resize-none focus:outline-none placeholder-slate-600 px-3 py-2"
            style={{ maxHeight: '120px' }}
          />
          <button
            onClick={() => send(input)}
            disabled={loading || !input.trim()}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
            Send
          </button>
        </div>
        <p className="text-center text-xs text-slate-700 mt-2">Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  )
}
