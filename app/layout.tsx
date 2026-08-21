import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from 'next'
import { Inter, Space_Grotesk, Press_Start_2P } from 'next/font/google'
import '@/styles/globals.css'
import { Navbar } from '@/components/Navbar'
import { CommandPalette } from '@/components/CommandPalette'
import { GridEvent } from '@/components/GridEvent'
import { ScrollProgress } from '@/components/ScrollProgress'
import { CrtMode } from '@/components/CrtMode'
import { ConsoleEgg } from '@/components/ConsoleEgg'
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const space = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' })
const pixel = Press_Start_2P({ weight: '400', subsets: ['latin'], variable: '--font-pixel' })

export const metadata: Metadata = {
  title: 'Mayank Dixit | AI Engineer',
  description: 'Portfolio: ML systems, agentic AI, and quantitative modeling across trading, aerospace research, and energy.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${space.variable} ${pixel.variable} dark`}>
      <body className="min-h-screen bg-bg text-text">
        <div className="pointer-events-none fixed inset-0 bg-grid" />
        <div className="pointer-events-none fixed inset-0 bg-aurora" />
        <div className="pointer-events-none fixed inset-0 bg-glow opacity-80" />
        <ScrollProgress />
        <Navbar />
        <CommandPalette />
        <GridEvent />
        <CrtMode />
        <ConsoleEgg />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
