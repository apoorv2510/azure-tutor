'use client'
import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex h-screen items-center justify-center" style={{ background: '#080c14', color: '#f1f5f9' }}>
      <div className="text-center px-6">
        <div className="text-4xl mb-4">⚠️</div>
        <h2 className="text-lg font-semibold text-white mb-2">Something went wrong</h2>
        <p className="text-slate-500 text-sm mb-6">{error.message || 'An unexpected error occurred'}</p>
        <button
          onClick={reset}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}
        >
          Try again
        </button>
      </div>
    </div>
  )
}
