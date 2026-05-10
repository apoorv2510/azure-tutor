import { signIn, auth } from '@/auth'
import { configuredProviders } from '@/auth'
import { redirect } from 'next/navigation'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>
}) {
  const session = await auth()
  if (session) redirect('/')

  const params = await searchParams
  // Reject external URLs to prevent open redirect attacks
  const raw = params.callbackUrl ?? '/'
  const callbackUrl = raw.startsWith('/') && !raw.startsWith('//') ? raw : '/'
  const error = params.error

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: '#080c14' }}>

      <div className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(59,130,246,0.08), transparent)' }} />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-base font-bold text-white shadow-lg shadow-blue-900/50">
            Az
          </div>
          <div>
            <div className="text-base font-semibold text-white">AzurePro</div>
            <div className="text-xs text-slate-500">Certification Prep</div>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}>

          <h1 className="text-xl font-semibold text-white mb-1 text-center">Sign in to AzurePro</h1>
          <p className="text-sm text-slate-500 text-center mb-6">
            Unlock AZ-104 content and AI tutor
          </p>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl text-sm text-red-300 text-center"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
              {error === 'OAuthAccountNotLinked'
                ? 'That email is already linked to another provider.'
                : 'Sign in failed. Please try again.'}
            </div>
          )}

          <div className="space-y-3">
            {configuredProviders.google && (
              <form action={async () => {
                'use server'
                await signIn('google', { redirectTo: callbackUrl })
              }}>
                <button type="submit"
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-900 bg-white hover:bg-slate-100 transition-colors">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
                    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
                    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
                    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>
              </form>
            )}

            {configuredProviders.github && (
              <form action={async () => {
                'use server'
                await signIn('github', { redirectTo: callbackUrl })
              }}>
                <button type="submit"
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white transition-colors"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                  </svg>
                  Continue with GitHub
                </button>
              </form>
            )}

            {!configuredProviders.google && !configuredProviders.github && (
              <p className="text-center text-sm text-slate-500 py-4">
                No sign-in providers configured yet.
              </p>
            )}
          </div>

          <div className="mt-6 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-start gap-2">
              <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
              <p className="text-xs text-slate-500 leading-relaxed">
                <strong className="text-slate-400">AZ-900 is always free</strong> — no account needed.
                Sign in to unlock AZ-104 Administrator content and the AI tutor.
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-700 mt-6">
          No password required. Secure OAuth login.
        </p>
      </div>
    </div>
  )
}
