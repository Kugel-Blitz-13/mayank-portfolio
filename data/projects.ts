export type Project = {
  slug: string
  title: string
  subtitle: string
  year?: string
  tags: string[]
  hero?: {
    kind: 'video' | 'image'
    src: string
    poster?: string
    alt?: string
  }
  links?: { label: string; href: string }[]
  highlights: string[]
  summary: string
}

export const featuredProjects: Project[] = [
  {
    slug: 'grid-scout',
    title: 'Grid-Scout',
    subtitle: 'Smart siting for gigawatt-scale data centers',
    year: '2025',
    tags: ['optimization', 'energy systems', 'web app', 'geospatial'],
    hero: {
      kind: 'video',
      src: '/media/gridscout_hero.mp4',
      poster: '/media/gridscout_poster.jpg',
      alt: 'Grid-Scout demo'
    },
    highlights: [
      'Scores U.S. locations by co-optimizing transmission headroom, proximity to clean generation, reliability, and emissions impact.',
      'Built an interactive siting engine UI for “big loads” to explore tradeoffs and pick candidate states/regions.'
    ],
    summary:
      'A hackathon prototype that helps place large loads where they support the grid: reduce congestion risk, improve reliability, and keep marginal emissions low.'
  },
  {
    slug: 'mcp-aero-design',
    title: 'Modular MCP Servers for Aero Design Automation',
    subtitle: 'Industry-sponsored (NDA) — agent-ready tool interfaces',
    year: '2025–Present',
    tags: ['AI agents', 'MCP', 'CFD', 'tooling', 'robust APIs'],
    highlights: [
      'Built an AI-agent orchestration layer that can reliably invoke three MCP servers (TiGL, SU2, pyCycle) in sequence for design iteration workflows.',
      'Focused on production-grade interfaces: strict schemas, session isolation, structured JSON outputs, and testable, repeatable tool execution (overview only).'
    ],
    summary:
      'NDA-limited research on making complex engineering tools agent-callable via robust MCP interfaces; public details are shared at a high level only.'
  },
  {
    slug: 'fifa-analytics',
    title: 'FIFA Player Analytics + ML Pipeline',
    subtitle: 'GCP + Spark + PostgreSQL + multi-model regression',
    year: '2026',
    tags: ['GCP', 'Spark', 'PostgreSQL', 'ML pipeline'],
    highlights: [
      'End-to-end pipeline: ingest (2015–2022), unify schemas, and enable scalable analytics in PostgreSQL.',
      'Trained and benchmarked multiple regression models (Spark MLlib + deep learning) for value or rating prediction on GCP.'
    ],
    summary:
      'A cloud-deployed analytics and modeling pipeline for large, multi-year sports datasets.'
  },
  {
    slug: 'adversarial-robust-autonomy',
    title: 'Adversarial Robustness Prototype for Autonomous Driving',
    subtitle: 'Hardware demo using Raspberry Pi + Arduino modules',
    year: '2022',
    tags: ['computer vision', 'robustness', 'robotics', 'prototype'],
    hero: {
      kind: 'image',
      src: '/media/prototype_1.jpg',
      alt: 'Autonomous driving robustness prototype'
    },
    highlights: [
      'Identified adversarial-attack vulnerabilities and built a real-world prototype to demonstrate practical robustness.',
      'Integrated embedded compute + sensing and validated behavior in controlled test scenarios.'
    ],
    summary:
      'A hands-on prototype that connects adversarial ML insights to a physical autonomy demo.'
  }
]

export const moreProjects: Project[] = [
  {
    slug: 'private-rag-chatbot',
    title: 'Private RAG Chatbot for Enterprise Knowledge',
    subtitle: 'FAISS + local Llama to reduce latency and API spend',
    year: '2024–2025',
    tags: ['RAG', 'FAISS', 'LLM', 'enterprise'],
    highlights: [
      'Built a private RAG chatbot with FAISS and a local Llama model to reduce API cost and speed up retrieval.',
      'Mentored interns and shipped an internal tool for analysts.'
    ],
    summary:
      'A cost-aware internal assistant for fast, private knowledge retrieval.'
  },
  {
    slug: 'bearing-fault-vit',
    title: 'Bearing-Fault Detection Pipeline',
    subtitle: 'Vision Transformers + complex-frequency features for noisy vibration',
    year: '2022–2023',
    tags: ['signal processing', 'ViT', 'robust ML'],
    highlights: [
      'Proposed a bearing-fault pipeline combining Vision Transformers with complex-frequency features for robustness on noisy signals.',
      'Published work in ICCCNT 2023 (IEEE) and ICAET 2023 (accepted) on bearing fault classification and detection.'
    ],
    summary:
      'Research on robust diagnostics for industrial vibration data.'
  }
]
