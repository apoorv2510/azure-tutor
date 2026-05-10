'use client'
import { useState } from 'react'
import { Topic } from '@/app/data/curriculum'
import { quizzes, QuizQuestion } from '@/app/data/quizzes'

type Props = {
  topic: Topic
  onDone: (score: number, total: number) => void
  onBack: () => void
}

export default function QuizView({ topic, onDone, onBack }: Props) {
  const questions: QuizQuestion[] = quizzes[topic.id] ?? []
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [results, setResults] = useState<boolean[]>([])

  if (questions.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3">🧪</div>
          <p className="text-slate-500">No quiz available for this topic yet.</p>
          <button onClick={onBack} className="mt-4 text-blue-400 hover:text-blue-300 text-sm transition-colors">← Back to lesson</button>
        </div>
      </div>
    )
  }

  const q = questions[current]

  const handleSelect = (idx: number) => {
    if (answered) return
    setSelected(idx)
    setAnswered(true)
    const correct = idx === q.correct
    if (correct) setScore(s => s + 1)
    setResults(r => [...r, correct])
  }

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      setFinished(true)
      onDone(score + (selected === q.correct ? 1 : 0), questions.length)
    } else {
      setCurrent(c => c + 1)
      setSelected(null)
      setAnswered(false)
    }
  }

  const finalScore = results.filter(Boolean).length

  if (finished) {
    const pct = Math.round((finalScore / questions.length) * 100)
    const passed = pct >= 80
    return (
      <div className="flex-1 overflow-y-auto flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          {/* Score card */}
          <div className="text-center p-8 rounded-2xl mb-6"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="text-5xl mb-4">{pct >= 80 ? '🎉' : pct >= 60 ? '👍' : '📚'}</div>
            <div className="text-5xl font-bold mb-2" style={{
              color: passed ? '#34d399' : pct >= 60 ? '#fbbf24' : '#f87171'
            }}>
              {finalScore}/{questions.length}
            </div>
            <div className="text-lg font-semibold text-white mb-1">
              {passed ? 'Excellent work!' : pct >= 60 ? 'Good effort!' : 'Keep studying!'}
            </div>
            <div className="text-sm text-slate-400">{pct}% — {passed ? 'You\'re ready to move on' : 'Review the lesson and retry'}</div>
          </div>

          {/* Per-question results */}
          <div className="space-y-1.5 mb-6">
            {results.map((correct, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm"
                style={{
                  background: correct ? 'rgba(52,211,153,0.07)' : 'rgba(248,113,113,0.07)',
                  border: `1px solid ${correct ? 'rgba(52,211,153,0.2)' : 'rgba(248,113,113,0.2)'}`
                }}>
                <span className={correct ? 'text-emerald-400' : 'text-red-400'}>{correct ? '✓' : '✗'}</span>
                <span className="text-slate-400 text-xs truncate">Q{i + 1}: {questions[i].question.slice(0, 65)}…</span>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => { setCurrent(0); setSelected(null); setAnswered(false); setScore(0); setFinished(false); setResults([]) }}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-amber-300 transition-all"
              style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)' }}>
              🔄 Retake
            </button>
            <button onClick={onBack}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-300 transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              📖 Back to Lesson
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto min-w-0">
      {/* Header — hidden on mobile (mobile bar is in page.tsx) */}
      <div className="hidden md:flex sticky top-0 z-10 px-6 py-3 items-center justify-between"
        style={{ background: 'rgba(8,12,20,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-sm text-slate-500 hover:text-white transition-colors">← Back</button>
          <span style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>
          <span className="text-sm font-medium text-white truncate">Quiz: {topic.title}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-500">{current + 1} / {questions.length}</div>
          <div className="text-xs font-semibold text-emerald-400">Score: {score}</div>
        </div>
      </div>
      {/* Mobile quiz header */}
      <div className="md:hidden flex items-center justify-between px-4 py-2 text-xs"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <span className="text-slate-500">Q{current + 1}/{questions.length}</span>
        <span className="text-emerald-400 font-semibold">Score: {score}</span>
      </div>

      {/* Progress bar */}
      <div className="h-0.5" style={{ background: 'rgba(255,255,255,0.07)' }}>
        <div className="h-full bg-blue-500 transition-all duration-500"
          style={{ width: `${(current / questions.length) * 100}%` }} />
      </div>

      <div className="px-4 sm:px-8 py-5 sm:py-8 max-w-2xl mx-auto">
        {/* Question number */}
        <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">
          Question {current + 1} of {questions.length}
        </div>

        {/* Question text */}
        <div className="mb-7 p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-white text-base leading-relaxed font-medium">{q.question}</p>
        </div>

        {/* Options */}
        <div className="space-y-2.5 mb-6">
          {q.options.map((opt, idx) => {
            let bg = 'rgba(255,255,255,0.03)'
            let border = 'rgba(255,255,255,0.08)'
            let textColor = '#94a3b8'
            let cursor = 'cursor-pointer'

            if (answered) {
              cursor = 'cursor-default'
              if (idx === q.correct) {
                bg = 'rgba(52,211,153,0.1)'
                border = 'rgba(52,211,153,0.4)'
                textColor = '#a7f3d0'
              } else if (idx === selected) {
                bg = 'rgba(248,113,113,0.1)'
                border = 'rgba(248,113,113,0.4)'
                textColor = '#fca5a5'
              } else {
                bg = 'rgba(255,255,255,0.02)'
                border = 'rgba(255,255,255,0.05)'
                textColor = '#475569'
              }
            }

            return (
              <button key={idx} onClick={() => handleSelect(idx)}
                className={`w-full text-left px-5 py-4 rounded-xl transition-all flex items-start gap-3 ${cursor}`}
                style={{ background: bg, border: `1px solid ${border}` }}
                onMouseEnter={e => { if (!answered) e.currentTarget.style.border = '1px solid rgba(59,130,246,0.4)' }}
                onMouseLeave={e => { if (!answered) e.currentTarget.style.border = `1px solid ${border}` }}>
                <span className="text-sm font-mono shrink-0 mt-0.5" style={{ color: textColor }}>
                  {String.fromCharCode(65 + idx)}.
                </span>
                <span className="text-sm leading-relaxed flex-1" style={{ color: textColor }}>{opt}</span>
                {answered && idx === q.correct && <span className="text-emerald-400 shrink-0 ml-auto">✓</span>}
                {answered && idx === selected && idx !== q.correct && <span className="text-red-400 shrink-0 ml-auto">✗</span>}
              </button>
            )
          })}
        </div>

        {/* Explanation */}
        {answered && (
          <div className="mb-6 p-4 rounded-xl"
            style={{ background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.2)' }}>
            <div className="flex items-center gap-2 mb-2">
              <span className={selected === q.correct ? 'text-emerald-400 font-semibold text-sm' : 'text-red-400 font-semibold text-sm'}>
                {selected === q.correct ? '✓ Correct!' : '✗ Incorrect'}
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">{q.explanation}</p>
          </div>
        )}

        {answered && (
          <button onClick={handleNext}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all btn-primary"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
            {current + 1 >= questions.length ? 'See Results →' : 'Next Question →'}
          </button>
        )}
      </div>
    </div>
  )
}
