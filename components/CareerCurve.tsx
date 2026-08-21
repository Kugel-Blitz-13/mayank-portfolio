'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

type Milestone = {
  year: string
  role: string
  org: string
  detail: string
}

const milestones: Milestone[] = [
  {
    year: '2019',
    role: 'B.Tech, Electrical Engineering',
    org: 'NSUT Delhi',
    detail:
      'Started Electrical Engineering with a minor in ML and Data Science, backed by the Indian Air Force Benevolent Association national scholarship.'
  },
  {
    year: '2021',
    role: 'First place of 110 teams',
    org: 'IIT Ropar Hackathon',
    detail:
      'Built Agri.AI with my team: an end to end ML platform for farmers covering crop quality, price suggestion, and yield prediction from soil and crop type.'
  },
  {
    year: '2022',
    role: 'Research Intern',
    org: 'IIT Kharagpur + NSUT thesis',
    detail:
      'Adversarial robustness for autonomous driving, published at CVIP 2022. Computer vision roles at Skylark Labs and IIT Gandhinagar, plus a bearing fault thesis that became two more papers.'
  },
  {
    year: '2023',
    role: 'Data Scientist',
    org: 'Gentari (PETRONAS)',
    detail:
      'Joined the clean energy arm of PETRONAS. Automated portal uploads for 40 solar and wind plants, deployed inverter fault detection, and built cost estimation models.'
  },
  {
    year: '2024',
    role: 'Senior Data Scientist',
    org: 'Gentari (PETRONAS)',
    detail:
      'Promoted. Productionized an in house solar forecast that beat vendor accuracy, launched a private RAG chatbot, and led a Microsoft partnered forecasting framework on Azure.'
  },
  {
    year: '2025',
    role: 'M.S. AI Engineering + Research Assistant',
    org: 'Carnegie Mellon University',
    detail:
      'Moved to CMU for AI Engineering in Energy. Boeing funded research on MCP agent pipelines for aircraft design, an AI coach deployed on AWS, and Grid Scout at the MIT Energy Hackathon.'
  },
  {
    year: '2026',
    role: 'Quantitative Analyst Intern',
    org: 'Five Dimensions Energy',
    detail:
      'Load forecasting on a PJM trading desk. Improved the production day ahead model, shipped a real time forecast for 20 zones, and mapped data center load growth.'
  }
]

const peaks = [
  { x: 60, y: 248 },
  { x: 205, y: 220 },
  { x: 350, y: 192 },
  { x: 495, y: 168 },
  { x: 640, y: 136 },
  { x: 785, y: 102 },
  { x: 930, y: 64 }
]

const curvePoints = (() => {
  const pts: { x: number; y: number }[] = []
  for (let i = 0; i < peaks.length; i++) {
    pts.push(peaks[i])
    if (i < peaks.length - 1) {
      pts.push({
        x: (peaks[i].x + peaks[i + 1].x) / 2,
        y: Math.max(peaks[i].y, peaks[i + 1].y) + 26
      })
    }
  }
  return pts
})()

function catmullRomPath(pts: { x: number; y: number }[]) {
  let d = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[Math.min(i + 2, pts.length - 1)]
    const c1x = p1.x + (p2.x - p0.x) / 6
    const c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6
    const c2y = p2.y - (p3.y - p1.y) / 6
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x} ${p2.y}`
  }
  return d
}

const linePath = catmullRomPath(curvePoints)
const areaPath = `${linePath} L 930 300 L 60 300 Z`
const gridYs = [80, 135, 190, 245]

export function CareerCurve() {
  const [active, setActive] = useState(milestones.length - 1)
  const current = milestones[active]

  return (
    <div>
      <div className="glass rounded-3xl p-4 sm:p-6">
        <svg viewBox="0 0 1000 332" className="w-full" role="img" aria-label="Career timeline drawn as a rising load curve">
          <defs>
            <linearGradient id="ccLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgb(45 212 191)" />
              <stop offset="100%" stopColor="rgb(96 165 250)" />
            </linearGradient>
            <linearGradient id="ccArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(45,212,191,0.28)" />
              <stop offset="100%" stopColor="rgba(45,212,191,0)" />
            </linearGradient>
          </defs>

          {gridYs.map((y) => (
            <line key={y} x1={60} y1={y} x2={930} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
          ))}
          <line x1={60} y1={300} x2={930} y2={300} stroke="rgba(255,255,255,0.14)" strokeWidth={1} />

          <text
            x={24}
            y={182}
            textAnchor="middle"
            fontSize={13}
            fill="rgba(255,255,255,0.35)"
            transform="rotate(-90 24 182)"
          >
            ambition →
          </text>
          <text x={998} y={304} textAnchor="end" fontSize={13} fill="rgba(255,255,255,0.35)">
            years →
          </text>

          <motion.path
            d={areaPath}
            fill="url(#ccArea)"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 1.1 }}
          />
          <motion.path
            d={linePath}
            fill="none"
            stroke="url(#ccLine)"
            strokeWidth={3}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.8, ease: 'easeInOut' }}
          />

          <line
            x1={peaks[active].x}
            y1={peaks[active].y}
            x2={peaks[active].x}
            y2={300}
            stroke="rgba(45,212,191,0.35)"
            strokeWidth={1}
            strokeDasharray="4 4"
          />

          {peaks.map((p, i) => (
            <g
              key={milestones[i].year}
              className="cursor-pointer"
              onMouseEnter={() => setActive(i)}
              onClick={() => setActive(i)}
            >
              <circle cx={p.x} cy={p.y} r={22} fill="transparent" />
              {active === i ? (
                <circle cx={p.x} cy={p.y} r={12} fill="none" stroke="rgba(45,212,191,0.45)" strokeWidth={2} />
              ) : null}
              <circle
                cx={p.x}
                cy={p.y}
                r={active === i ? 7 : 5}
                fill={active === i ? 'rgb(45 212 191)' : 'rgb(96 165 250)'}
              />
              <text
                x={p.x}
                y={322}
                textAnchor="middle"
                fontSize={15}
                fill={active === i ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.45)'}
              >
                {milestones[i].year}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {milestones.map((m, i) => (
          <button
            key={m.year}
            type="button"
            onClick={() => setActive(i)}
            className={
              active === i
                ? 'rounded-full border border-accent/50 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent'
                : 'rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/60 transition hover:bg-white/10 hover:text-white'
            }
          >
            {m.year}
          </button>
        ))}
      </div>

      <div className="glass mt-4 min-h-[132px] rounded-3xl p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.year}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h3 className="text-base font-semibold text-white">{current.role}</h3>
              <span className="text-sm text-accent">{current.org}</span>
              <span className="text-xs text-white/40">{current.year}</span>
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/70">{current.detail}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
