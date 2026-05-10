'use client'
import Script from 'next/script'
import { useEffect } from 'react'

const PUB_ID = 'ca-pub-2559563383301990'

export function AdSenseScript() {
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
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
    } catch {}
  }, [])

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
