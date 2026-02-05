import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import '@/styles/globals.css'
import { Navbar } from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const space = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' })

export const metadata: Metadata = {
  title: 'Mayank Dixit | AI Engineer',
  description: 'Portfolio: agentic systems, ML infra, and clean-tech optimization.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${space.variable} dark`}>
      <body className="min-h-screen bg-bg text-text">
        <div className="pointer-events-none fixed inset-0 bg-grid" />
        <div className="pointer-events-none fixed inset-0 bg-glow opacity-80" />
        <Navbar />
        {children}
      </body>
    </html>
  )
}
