'use client'
import { useState } from 'react'
import { useSession, signIn } from 'next-auth/react'
import Sidebar from '@/app/components/Sidebar'
import LessonView from '@/app/components/LessonView'
import QuizView from '@/app/components/QuizView'
import AskView from '@/app/components/AskView'
import ResourcesView from '@/app/components/ResourcesView'
import { useProgress } from '@/app/hooks/useProgress'
import { getTopicById } from '@/app/data/curriculum'

type Mode = 'lesson' | 'quiz' | 'ask' | 'resources'

export default function Home() {
  const [activeTopic, setActiveTopic] = useState<string | null>(null)
  const [mode, setMode] = useState<Mode>('lesson')
  const { getStatus, markProgress, studied, totalTopics } = useProgress()
  const { data: session } = useSession()

  const handleSelectTopic = (id: string) => {
    const topic = getTopicById(id)
    // Gate AZ-104 topics for non-authenticated users
    if (topic?.exam === 'AZ-104' && !session) {
      setActiveTopic(id)
      setMode('lesson')
      return
    }
    setActiveTopic(id)
    setMode('lesson')
    markProgress(id, 'studied')
  }

  const topic = activeTopic ? getTopicById(activeTopic) : null
  const isLocked = topic?.exam === 'AZ-104' && !session

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#080c14', color: '#f1f5f9' }}>
      <Sidebar
        activeTopic={activeTopic}
        getStatus={getStatus}
        onSelectTopic={handleSelectTopic}
        studied={studied}
        totalTopics={totalTopics}
        onShowResources={() => { setActiveTopic(null); setMode('resources') }}
      />

      <main className="flex-1 overflow-hidden flex flex-col min-w-0">
        {mode === 'resources' ? (
          <ResourcesView getStatus={getStatus} onSelectTopic={handleSelectTopic} />
        ) : !topic ? (
          <HomePage onSelectResources={() => setMode('resources')} />
        ) : isLocked ? (
          <AuthGate topicTitle={topic.title} />
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
  )
}

function AuthGate({ topicTitle }: { topicTitle: string }) {
  return (
    <div className="flex-1 flex items-center justify-center px-8">
      <div className="text-center max-w-sm">
        <div className="text-4xl mb-6">🔒</div>
        <h2 className="text-xl font-semibold text-white mb-2">Sign in to unlock AZ-104</h2>
        <p className="text-sm text-slate-500 mb-2">
          <strong className="text-slate-400">{topicTitle}</strong> is part of the AZ-104 Administrator curriculum.
        </p>
        <p className="text-xs text-slate-600 mb-8">
          AZ-900 content is always free. Sign in with Google or GitHub to access AZ-104 lessons, quizzes, and AI tutor.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => signIn('google')}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-900 bg-white hover:bg-slate-100 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <button
            onClick={() => signIn('github')}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white transition-colors"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
            </svg>
            Continue with GitHub
          </button>
        </div>
      </div>
    </div>
  )
}

function HomePage({ onSelectResources }: { onSelectResources: () => void }) {
  return (
    <div className="flex-1 overflow-y-auto">
      {/* Hero */}
      <div className="relative px-12 pt-16 pb-12 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(59,130,246,0.12), transparent)'
        }} />

        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-blue-300 mb-6"
            style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse inline-block" />
            AZ-900 → AZ-104 → AZ-305 Architect Path
          </div>

          <h1 className="text-4xl font-bold text-white mb-4 leading-tight tracking-tight">
            Pass Your Azure Certification<br />
            <span className="text-transparent bg-clip-text" style={{
              backgroundImage: 'linear-gradient(135deg, #60a5fa, #818cf8)'
            }}>on the first attempt</span>
          </h1>

          <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            Structured lessons, realistic exam questions, and an AI tutor — everything you need to become an Azure Solutions Architect.
          </p>

          <p className="text-slate-600 text-sm">← Pick a topic from the sidebar to begin</p>
        </div>
      </div>

      {/* Stats */}
      <div className="px-12 mb-10">
        <div className="grid grid-cols-4 gap-4 max-w-3xl mx-auto">
          {[
            { value: '15', label: 'Topics covered', icon: '📚' },
            { value: '100+', label: 'Quiz questions', icon: '🧪' },
            { value: '2', label: 'Certifications', icon: '🏆' },
            { value: 'Free', label: 'AI tutor included', icon: '💬' },
          ].map(s => (
            <div key={s.label} className="text-center p-4 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="text-xl mb-1">{s.icon}</div>
              <div className="text-xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="px-12 mb-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">How it works</h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: '📖', title: 'Read the lesson', desc: 'Deep-dive lessons with tables, code examples, real-world analogies, and exam tips for every topic.' },
              { icon: '🧪', title: 'Test yourself', desc: 'Scenario-based questions just like the real exam. Instant feedback with detailed explanations.' },
              { icon: '💬', title: 'Ask the AI tutor', desc: 'Stuck on a concept? Ask anything. Get analogies, scenarios, and custom deep-dives on demand.' },
            ].map(f => (
              <div key={f.title} className="p-5 rounded-2xl card-hover"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="text-2xl mb-3">{f.icon}</div>
                <div className="text-sm font-semibold text-white mb-2">{f.title}</div>
                <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cert path */}
      <div className="px-12 mb-12">
        <div className="max-w-3xl mx-auto p-6 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Certification Path</h2>
          <div className="flex items-center gap-4">
            {[
              { badge: 'AZ-900', label: 'Azure Fundamentals', color: 'text-blue-400', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.25)', topics: '8 topics · Free' },
              { badge: '→', label: '', color: 'text-slate-600', bg: 'transparent', border: 'transparent', topics: '' },
              { badge: 'AZ-104', label: 'Azure Administrator', color: 'text-violet-400', bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.25)', topics: '7 topics · Sign in' },
              { badge: '→', label: '', color: 'text-slate-600', bg: 'transparent', border: 'transparent', topics: '' },
              { badge: 'AZ-305', label: 'Solutions Architect Expert', color: 'text-slate-500', bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)', topics: 'Coming soon' },
            ].map((c, i) => (
              c.badge === '→'
                ? <span key={i} className="text-slate-700 text-xl">→</span>
                : (
                  <div key={i} className="flex-1 p-4 rounded-xl text-center"
                    style={{ background: c.bg, border: `1px solid ${c.border}` }}>
                    <div className={`font-bold font-mono ${c.color} mb-1`}>{c.badge}</div>
                    <div className="text-xs text-slate-400 mb-1">{c.label}</div>
                    <div className="text-xs text-slate-600">{c.topics}</div>
                  </div>
                )
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
