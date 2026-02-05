import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './data/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Arial"],
        space: ["var(--font-space)", "var(--font-inter)", "system-ui"]
      },
      colors: {
        bg: 'rgb(var(--bg))',
        surface: 'rgb(var(--surface))',
        card: 'rgb(var(--card))',
        text: 'rgb(var(--text))',
        muted: 'rgb(var(--muted))',
        accent: 'rgb(var(--accent))',
        accent2: 'rgb(var(--accent2))'
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem'
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,255,255,0.06), 0 24px 64px rgba(0,0,0,0.55)'
      },
      backgroundImage: {
        'grid-fade': 'radial-gradient(closest-side, rgba(0,0,0,0), rgba(0,0,0,0.85)), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px)'
      }
    }
  },
  plugins: []
}

export default config
