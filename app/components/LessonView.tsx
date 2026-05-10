'use client'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Topic, Resource } from '@/app/data/curriculum'
import { lessons } from '@/app/data/lessons'

type Props = {
  topic: Topic
  onStartQuiz: () => void
  onStartChat: () => void
}

const resourceTypeConfig: Record<Resource['type'], { icon: string; color: string; border: string; label: string }> = {
  learn:    { icon: '🎓', color: 'text-blue-300',   border: 'rgba(59,130,246,0.25)',  label: 'MS Learn' },
  docs:     { icon: '📄', color: 'text-slate-300',  border: 'rgba(255,255,255,0.12)', label: 'Docs' },
  practice: { icon: '🧪', color: 'text-amber-300',  border: 'rgba(245,158,11,0.25)', label: 'Practice' },
  video:    { icon: '🎬', color: 'text-violet-300', border: 'rgba(139,92,246,0.25)', label: 'Video' },
}

export default function LessonView({ topic, onStartQuiz, onStartChat }: Props) {
  const content = lessons[topic.id]
  const isAz900 = topic.exam === 'AZ-900'

  return (
    <div className="flex-1 overflow-y-auto min-w-0">
      {/* Top nav bar */}
      <div className="sticky top-0 z-10 px-6 py-3 flex items-center justify-between"
        style={{ background: 'rgba(8,12,20,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-3 min-w-0">
          <span className={`text-xs font-mono font-semibold px-2.5 py-1 rounded-lg shrink-0 ${
            isAz900 ? 'text-blue-300' : 'text-violet-300'
          }`} style={{
            background: isAz900 ? 'rgba(59,130,246,0.12)' : 'rgba(139,92,246,0.12)',
            border: `1px solid ${isAz900 ? 'rgba(59,130,246,0.25)' : 'rgba(139,92,246,0.25)'}`
          }}>
            {topic.exam}
          </span>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-white truncate">{topic.title}</div>
            <div className="text-xs text-slate-500 truncate">{topic.domain}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-4">
          <span className="text-xs text-amber-400/70 font-medium hidden sm:block">{topic.weight} of exam</span>
          <button onClick={onStartQuiz}
            className="text-xs px-3 py-1.5 rounded-lg font-medium text-amber-300 transition-colors"
            style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,158,11,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(245,158,11,0.12)'}>
            🧪 Quiz
          </button>
          <button onClick={onStartChat}
            className="text-xs px-3 py-1.5 rounded-lg font-medium text-blue-300 transition-colors"
            style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(59,130,246,0.12)'}>
            💬 Ask AI
          </button>
        </div>
      </div>

      <div className="px-8 py-6 max-w-3xl">

        {/* Key focus strip */}
        <div className="mb-7 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Exam focus</span>
            <span className="text-xs font-mono text-amber-400 ml-auto">{topic.weight} weight</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {topic.keyPoints.map((kp, i) => (
              <span key={i} className="text-xs text-slate-400 px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {kp}
              </span>
            ))}
          </div>
        </div>

        {/* Lesson markdown */}
        {content ? (
          <div className="lesson-prose">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <ReactMarkdown remarkPlugins={[remarkGfm as any]}>{content}</ReactMarkdown>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-4xl mb-3">📝</div>
            <p className="text-slate-500">Content loading...</p>
          </div>
        )}

        {/* Resources section */}
        {topic.resources && topic.resources.length > 0 && (
          <div className="mt-10 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Official Resources</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {topic.resources.map((res, i) => {
                const cfg = resourceTypeConfig[res.type]
                return (
                  <a key={i} href={res.url} target="_blank" rel="noopener noreferrer"
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all group ${cfg.color}`}
                    style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${cfg.border}` }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}>
                    <span className="text-base shrink-0">{cfg.icon}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-medium truncate">{res.label}</div>
                      <div className="text-xs opacity-50 mt-0.5">{cfg.label}</div>
                    </div>
                    <span className="text-xs opacity-0 group-hover:opacity-40 shrink-0 transition-opacity">↗</span>
                  </a>
                )
              })}
            </div>
          </div>
        )}

        {/* Bottom CTAs */}
        <div className="mt-8 pt-6 flex gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <button onClick={onStartQuiz}
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-amber-300 transition-all"
            style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,158,11,0.18)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(245,158,11,0.1)'}>
            🧪 Quiz yourself on this topic
          </button>
          <button onClick={onStartChat}
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-blue-300 transition-all"
            style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.18)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(59,130,246,0.1)'}>
            💬 Ask the AI tutor
          </button>
        </div>
      </div>
    </div>
  )
}
