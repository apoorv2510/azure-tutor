'use client'
import { curriculum, Resource } from '@/app/data/curriculum'

type Status = 'studied' | 'quizzed' | 'mastered' | null

type Props = {
  getStatus: (id: string) => Status
  onSelectTopic: (id: string) => void
}

const resIcon: Record<Resource['type'], string> = {
  learn: '🎓', docs: '📄', practice: '🧪', video: '🎬',
}
const resColor: Record<Resource['type'], string> = {
  learn: 'text-blue-400', docs: 'text-slate-400', practice: 'text-amber-400', video: 'text-violet-400',
}

const statusConfig: Record<string, { dot: string; cardBg: string; cardBorder: string; badge: string }> = {
  mastered: { dot: 'bg-emerald-400', cardBg: 'rgba(52,211,153,0.05)', cardBorder: 'rgba(52,211,153,0.2)', badge: 'text-emerald-300 bg-emerald-900/40' },
  quizzed:  { dot: 'bg-amber-400',   cardBg: 'rgba(245,158,11,0.05)',  cardBorder: 'rgba(245,158,11,0.2)',  badge: 'text-amber-300 bg-amber-900/40' },
  studied:  { dot: 'bg-blue-400',    cardBg: 'rgba(59,130,246,0.05)',  cardBorder: 'rgba(59,130,246,0.2)',  badge: 'text-blue-300 bg-blue-900/40' },
}

export default function ResourcesView({ getStatus, onSelectTopic }: Props) {
  const allPractice = curriculum.flatMap(e => e.topics.flatMap(t => t.resources.filter(r => r.type === 'practice')))

  return (
    <div className="flex-1 overflow-y-auto min-w-0">
      {/* Header */}
      <div className="sticky top-0 z-10 px-6 py-3"
        style={{ background: 'rgba(8,12,20,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <h1 className="text-sm font-semibold text-white">Official Resources</h1>
        <p className="text-xs text-slate-500">All Microsoft Learn paths, docs, and practice tools — click any topic to start studying</p>
      </div>

      <div className="px-6 py-6 max-w-5xl space-y-10">

        {/* Quick access: practice assessments */}
        <section>
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Free Practice Assessments</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { label: 'AZ-900 Practice Assessment', url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/practice/assessment?assessment-type=practice&assessmentId=23', color: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.25)', text: 'text-blue-300' },
              { label: 'AZ-104 Practice Assessment', url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-administrator/practice/assessment?assessment-type=practice&assessmentId=21', color: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.25)', text: 'text-violet-300' },
              { label: 'Azure Pricing Calculator', url: 'https://azure.microsoft.com/en-us/pricing/calculator/', color: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)', text: 'text-amber-300' },
              { label: 'TCO Calculator', url: 'https://azure.microsoft.com/en-us/pricing/tco/calculator/', color: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)', text: 'text-amber-300' },
              { label: 'Bicep Playground', url: 'https://aka.ms/bicepdemo', color: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.2)', text: 'text-emerald-300' },
              { label: 'Azure Products A-Z', url: 'https://azure.microsoft.com/en-us/products/', color: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.1)', text: 'text-slate-300' },
            ].map(item => (
              <a key={item.label} href={item.url} target="_blank" rel="noopener noreferrer"
                className={`flex items-center gap-3 p-3.5 rounded-xl transition-all group ${item.text}`}
                style={{ background: item.color, border: `1px solid ${item.border}` }}
                onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.15)'}
                onMouseLeave={e => e.currentTarget.style.filter = ''}>
                <span className="text-xl">🧪</span>
                <span className="text-xs font-medium flex-1">{item.label}</span>
                <span className="text-xs opacity-0 group-hover:opacity-50 transition-opacity">↗</span>
              </a>
            ))}
          </div>
        </section>

        {/* Per-exam topic grids */}
        {curriculum.map(exam => {
          const isAz900 = exam.id === 'az900'
          const color = isAz900 ? { text: 'text-blue-400', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.25)' }
                                : { text: 'text-violet-400', bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.25)' }

          return (
            <section key={exam.id}>
              <div className="flex items-center gap-3 mb-4">
                <span className={`text-sm font-bold font-mono px-3 py-1 rounded-lg ${color.text}`}
                  style={{ background: color.bg, border: `1px solid ${color.border}` }}>
                  {exam.title}
                </span>
                <span className="text-xs text-slate-500">{exam.level}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {exam.topics.map(topic => {
                  const status = getStatus(topic.id)
                  const sc = status ? statusConfig[status] : null

                  return (
                    <div key={topic.id} className="rounded-2xl p-4 transition-all"
                      style={{
                        background: sc ? sc.cardBg : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${sc ? sc.cardBorder : 'rgba(255,255,255,0.07)'}`,
                      }}>
                      {/* Topic header */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 mt-0.5 ${sc ? sc.dot : 'bg-slate-700'}`} />
                          <button onClick={() => onSelectTopic(topic.id)}
                            className="text-sm font-semibold text-white hover:text-blue-300 transition-colors text-left leading-tight">
                            {topic.title}
                          </button>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs text-slate-600 font-mono">{topic.weight}</span>
                          {status && (
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sc!.badge}`}>
                              {status}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 mb-3">{topic.domain}</p>

                      {/* Resource links */}
                      <div className="space-y-1.5">
                        {topic.resources.map((res, i) => (
                          <a key={i} href={res.url} target="_blank" rel="noopener noreferrer"
                            className={`flex items-center gap-2 text-xs transition-colors group hover:text-white ${resColor[res.type]}`}>
                            <span className="shrink-0">{resIcon[res.type]}</span>
                            <span className="truncate group-hover:underline">{res.label}</span>
                            <span className="ml-auto opacity-0 group-hover:opacity-40 shrink-0 transition-opacity">↗</span>
                          </a>
                        ))}
                      </div>

                      <button onClick={() => onSelectTopic(topic.id)}
                        className="mt-3 w-full py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-white transition-colors"
                        style={{ background: 'rgba(255,255,255,0.04)' }}>
                        Study this topic →
                      </button>
                    </div>
                  )
                })}
              </div>
            </section>
          )
        })}

      </div>
    </div>
  )
}
