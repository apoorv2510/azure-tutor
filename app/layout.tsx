import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import AuthProvider from '@/app/components/AuthProvider'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const viewport: Viewport = {
  themeColor: '#3b82f6',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  title: 'AzurePro — Azure Certification Prep',
  description: 'Study for AZ-900 and AZ-104. Lessons, quizzes, and AI tutor to pass your Azure certification on the first attempt.',
  keywords: ['Azure', 'AZ-900', 'AZ-104', 'Azure certification', 'cloud certification', 'Microsoft Azure'],
  authors: [{ name: 'AzurePro' }],
  creator: 'AzurePro',

  // PWA manifest
  manifest: '/manifest.json',

  // Open Graph (for sharing links)
  openGraph: {
    title: 'AzurePro — Azure Certification Prep',
    description: 'Pass AZ-900 and AZ-104 with structured lessons, quiz questions, and a free AI tutor.',
    type: 'website',
    locale: 'en_US',
  },

  // Icons
  icons: {
    icon: [
      { url: '/icons/icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-180.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/icons/icon-192.png',
  },

  // iOS specific
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'AzurePro',
    startupImage: [
      { url: '/icons/icon-512.png' },
    ],
  },

  // Robots
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <head>
        {/* iOS PWA - display as standalone app, no Safari UI */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="AzurePro" />
        <meta name="mobile-web-app-capable" content="yes" />
        {/* Prevents phone number detection messing with layout */}
        <meta name="format-detection" content="telephone=no" />
        {/* MS tile for Windows */}
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-TileImage" content="/icons/icon-144.png" />
      </head>
      <body className="antialiased overflow-hidden" style={{ background: '#080c14', color: '#f1f5f9' }}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
