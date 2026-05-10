'use client'
import { useEffect } from 'react'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html>
      <body style={{ background: '#080c14', color: '#f1f5f9', fontFamily: 'system-ui, sans-serif', margin: 0 }}>
        <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚠️</div>
            <h2 style={{ color: '#f1f5f9', fontWeight: 600, marginBottom: '0.5rem' }}>Something went wrong</h2>
            <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' }}>{error.message || 'An unexpected error occurred'}</p>
            <button
              onClick={reset}
              style={{ padding: '0.625rem 1.25rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer', fontWeight: 600, color: '#fff', background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
