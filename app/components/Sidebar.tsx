'use client'
import { curriculum, Topic } from '@/app/data/curriculum'

type Status = 'studied' | 'quizzed' | 'mastered' | null

type Props = {
  activeTopic: string | null
  getStatus: (id: string) => Status
  onSelectTopic: (id: string) => void
  studied: number
  totalTopics: number
  onShowResources: () => void
}

const statusDot: Record<string, string> = {
  mastered: 'bg-emerald-400',
  quizzed:  'bg-amber-400',
  studied:  'bg-blue-400',
}

export default function Sidebar({ activeTopic, getStatus, onSelectTopic, studied, totalTopics, onShowResources }: Props) {
  const pct = Math.round((studied / totalTopics) * 100)

  return (
    <aside className="w-64 flex flex-col h-screen shrink-0" style={{ background: '#0a0f1e', borderRight: '1px solid rgba(255,255,255,0.07)' }}>

      {/* Logo */}
      <div className="px-5 pt-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-sm font-bold text-white shadow-lg">
            Az
          </div>
          <div>
            <div className="text-sm font-semibold text-white">AzurePro</div>
            <div className="text-xs text-slate-500">Certification Prep</div>
          </div>
        </div>

        {/* Overall progress */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500">Your progress</span>
            <span className="text-xs font-semibold text-blue-400">{pct}%</span>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="text-xs text-slate-600">{studied} of {totalTopics} topics started</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3">

        {/* Resources link */}
        <button
          onClick={onShowResources}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg mb-3 text-sm text-slate-400 hover:text-white transition-colors"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <span className="text-base">🔗</span>
          <span>All Resources & Links</span>
        </button>

        {curriculum.map((exam) => {
          const isAz900 = exam.id === 'az900'
          const topics = exam.topics
          const masteredCount = topics.filter(t => getStatus(t.id) === 'mastered').length
          const examColor = isAz900 ? 'text-blue-400' : 'text-violet-400'
          const examBg = isAz900 ? 'rgba(59,130,246,0.1)' : 'rgba(139,92,246,0.1)'
          const examBorder = isAz900 ? 'rgba(59,130,246,0.2)' : 'rgba(139,92,246,0.2)'

          return (
            <div key={exam.id} className="mb-4">
              {/* Exam header */}
              <div className="flex items-center justify-between px-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold font-mono px-2 py-0.5 rounded-md ${examColor}`}
                    style={{ background: examBg, border: `1px solid ${examBorder}` }}
                  >
                    {exam.title}
                  </span>
                  <span className="text-xs text-slate-600">{exam.level}</span>
                </div>
                <span className="text-xs text-slate-600">{masteredCount}/{topics.length}</span>
              </div>

              {/* Topic list */}
              <div className="space-y-0.5">
                {topics.map((topic: Topic) => {
                  const status = getStatus(topic.id)
                  const isActive = activeTopic === topic.id

                  return (
                    <button
                      key={topic.id}
                      onClick={() => onSelectTopic(topic.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2.5 group transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      style={!isActive ? { background: 'transparent' } : {}}
                      onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                    >
                      {/* Status dot */}
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${status ? statusDot[status] : 'bg-slate-700'}`} />

                      {/* Title */}
                      <span className="text-xs font-medium flex-1 leading-tight truncate">
                        {topic.title}
                      </span>

                      {/* Weight */}
                      <span className={`text-xs shrink-0 font-mono ${isActive ? 'text-blue-200' : 'text-slate-700'}`}>
                        {topic.weight.split('-')[0]}%
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </nav>

      {/* Footer legend */}
      <div className="px-4 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-4 text-xs text-slate-600">
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block"/>read</span>
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block"/>quizzed</span>
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"/>mastered</span>
        </div>
      </div>
    </aside>
  )
}
