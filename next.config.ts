import type { NextConfig } from 'next'

const securityHeaders = [
  // Force HTTPS for 2 years, include subdomains
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  // Prevent clickjacking
  { key: 'X-Frame-Options', value: 'DENY' },
  // Stop MIME-type sniffing
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Control referrer info
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Disable browser features we don't use
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
  // XSS protection for older browsers
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  // Content Security Policy
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // Next.js needs unsafe-inline + unsafe-eval for its runtime
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      // Tailwind CSS needs unsafe-inline
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Only allow connections to our own domain + Pollinations AI
      "connect-src 'self' https://text.pollinations.ai https://fonts.gstatic.com",
      // Images from our domain + data URIs (for inline SVG)
      "img-src 'self' data: blob:",
      // Fonts
      "font-src 'self' data: https://fonts.gstatic.com",
      // Disallow all frames
      "frame-src 'none'",
      // Disallow object embeds
      "object-src 'none'",
      // Force HTTPS for all requests
      "upgrade-insecure-requests",
    ].join('; '),
  },
]

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },

  // Disable powered-by header (don't expose tech stack)
  poweredByHeader: false,

  // Strict mode catches more React bugs
  reactStrictMode: true,
}

export default nextConfig
