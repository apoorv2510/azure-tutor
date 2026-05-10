'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Sidebar from '@/app/components/Sidebar'
import LessonView from '@/app/components/LessonView'
import QuizView from '@/app/components/QuizView'
import AskView from '@/app/components/AskView'
import ResourcesView from '@/app/components/ResourcesView'
import AuthGateClient from '@/app/components/AuthGateClient'
import { useProgress } from '@/app/hooks/useProgress'
import { getTopicById } from '@/app/data/curriculum'

type Mode = 'lesson' | 'quiz' | 'ask' | 'resources'

export default function Home() {
  const [activeTopic, setActiveTopic] = useState<string | null>(null)
  const [mode, setMode] = useState<Mode>('lesson')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { getStatus, markProgress, studied, totalTopics } = useProgress()
  const { data: session } = useSession()

  const handleSelectTopic = (id: string) => {
    const topic = getTopicById(id)
    setActiveTopic(id)
    setMode('lesson')
    if (!(topic?.exam === 'AZ-104' && !session)) {
      markProgress(id, 'studied')
    }
  }

  const topic = activeTopic ? getTopicById(activeTopic) : null
  const isLocked = topic?.exam === 'AZ-104' && !session

  const currentTitle = mode === 'resources' ? 'Resources'
    : topic ? topic.title
    : 'AzurePro'

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#080c14', color: '#f1f5f9' }}>
      <Sidebar
        activeTopic={activeTopic}
        getStatus={getStatus}
        onSelectTopic={handleSelectTopic}
        studied={studied}
        totalTopics={totalTopics}
        onShowResources={() => { setActiveTopic(null); setMode('resources') }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 shrink-0"
          style={{ background: '#0a0f1e', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-8 h-8 flex flex-col items-center justify-center gap-1.5 rounded-lg shrink-0"
            style={{ background: 'rgba(255,255,255,0.06)' }}
            aria-label="Open menu"
          >
            <span className="w-4 h-0.5 bg-slate-400 rounded-full" />
            <span className="w-4 h-0.5 bg-slate-400 rounded-full" />
            <span className="w-3 h-0.5 bg-slate-400 rounded-full" />
          </button>
          <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-xs font-bold text-white shrink-0">Az</div>
          <span className="text-sm font-medium text-white truncate flex-1">{currentTitle}</span>
          {topic && !isLocked && (
            <div className="flex gap-1.5 shrink-0">
              <button onClick={() => setMode('quiz')}
                className="text-xs px-2.5 py-1.5 rounded-lg font-medium text-amber-300"
                style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)' }}>
                Quiz
              </button>
              <button onClick={() => setMode('ask')}
                className="text-xs px-2.5 py-1.5 rounded-lg font-medium text-blue-300"
                style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)' }}>
                AI
              </button>
            </div>
          )}
        </div>

        <main className="flex-1 overflow-hidden flex flex-col min-w-0">
          {mode === 'resources' ? (
            <ResourcesView getStatus={getStatus} onSelectTopic={handleSelectTopic} />
          ) : !topic ? (
            <HomePage onSelectResources={() => setMode('resources')} />
          ) : isLocked ? (
            <AuthGateClient topicTitle={topic.title} />
          ) : mode === 'lesson' ? (
            <LessonView topic={topic} onStartQuiz={() => setMode('quiz')} onStartChat={() => setMode('ask')} />
          ) : mode === 'quiz' ? (
            <QuizView
              topic={topic}
              onBack={() => setMode('lesson')}
              onDone={(score, total) => {
                markProgress(topic.id, score >= Math.ceil(total * 0.8) ? 'mastered' : 'quizzed')
                setMode('quiz')
              }}
            />
          ) : (
            <AskView topic={topic} onBack={() => setMode('lesson')} />
          )}
        </main>
      </div>
    </div>
  )
}

function HomePage({ onSelectResources }: { onSelectResources: () => void }) {
  return (
    <div className="flex-1 overflow-y-auto">
      {/* Hero */}
      <div className="relative px-5 sm:px-12 pt-10 sm:pt-16 pb-8 sm:pb-12 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(59,130,246,0.12), transparent)'
        }} />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-blue-300 mb-5"
            style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse inline-block" />
            AZ-900 → AZ-104 → AZ-305 Architect Path
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-3 sm:mb-4 leading-tight tracking-tight">
            Pass Your Azure Certification<br />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #60a5fa, #818cf8)' }}>
              on the first attempt
            </span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-lg mb-6 sm:mb-8 max-w-xl mx-auto leading-relaxed">
            Structured lessons, realistic exam questions, and an AI tutor — everything you need to become an Azure Solutions Architect.
          </p>
          <p className="text-slate-600 text-xs sm:text-sm">↓ Pick a topic from the menu to begin</p>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 sm:px-12 mb-8 sm:mb-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
          {[
            { value: '15', label: 'Topics covered', icon: '📚' },
            { value: '100+', label: 'Quiz questions', icon: '🧪' },
            { value: '2', label: 'Certifications', icon: '🏆' },
            { value: 'Free', label: 'AI tutor included', icon: '💬' },
          ].map(s => (
            <div key={s.label} className="text-center p-3 sm:p-4 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="text-lg sm:text-xl mb-1">{s.icon}</div>
              <div className="text-lg sm:text-xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="px-4 sm:px-12 mb-8 sm:mb-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: '📖', title: 'Read the lesson', desc: 'Deep-dive lessons with tables, code examples, real-world analogies, and exam tips for every topic.' },
              { icon: '🧪', title: 'Test yourself', desc: 'Scenario-based questions just like the real exam. Instant feedback with detailed explanations.' },
              { icon: '💬', title: 'Ask the AI tutor', desc: 'Stuck on a concept? Ask anything. Get analogies, scenarios, and custom deep-dives on demand.' },
            ].map(f => (
              <div key={f.title} className="p-4 sm:p-5 rounded-2xl card-hover"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="text-2xl mb-2 sm:mb-3">{f.icon}</div>
                <div className="text-sm font-semibold text-white mb-1 sm:mb-2">{f.title}</div>
                <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cert path */}
      <div className="px-4 sm:px-12 mb-10 sm:mb-12">
        <div className="max-w-3xl mx-auto p-4 sm:p-6 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Certification Path</h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
            {[
              { badge: 'AZ-900', label: 'Azure Fundamentals', color: 'text-blue-400', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.25)', topics: '8 topics · Free' },
              { badge: 'AZ-104', label: 'Azure Administrator', color: 'text-violet-400', bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.25)', topics: '7 topics · Sign in' },
              { badge: 'AZ-305', label: 'Solutions Architect Expert', color: 'text-slate-500', bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)', topics: 'Coming soon' },
            ].map((c, i) => (
              <div key={i} className="flex sm:flex-col sm:flex-1 items-center sm:items-stretch gap-3">
                {i > 0 && (
                  <span className="text-slate-700 text-lg sm:hidden">↓</span>
                )}
                {i > 0 && (
                  <span className="text-slate-700 text-xl hidden sm:block text-center mb-1">→</span>
                )}
                <div className="flex-1 sm:flex-none p-3 sm:p-4 rounded-xl text-center sm:text-center"
                  style={{ background: c.bg, border: `1px solid ${c.border}` }}>
                  <div className={`font-bold font-mono ${c.color} mb-0.5 sm:mb-1`}>{c.badge}</div>
                  <div className="text-xs text-slate-400 mb-0.5 sm:mb-1">{c.label}</div>
                  <div className="text-xs text-slate-600">{c.topics}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-center">
            <button onClick={onSelectResources}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
              View all official resources & practice exams →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
