'use client'
import Script from 'next/script'
import { useEffect } from 'react'

const PUB_ID = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID

export function AdSenseScript() {
  if (!PUB_ID) return null
  return (
    <Script
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${PUB_ID}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  )
}

export function AdBanner({ slot, className = '' }: { slot: string; className?: string }) {
  useEffect(() => {
    if (!PUB_ID) return
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
    } catch {}
  }, [])

  if (!PUB_ID) return null

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={{ display: 'block' }}
      data-ad-client={PUB_ID}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  )
}
