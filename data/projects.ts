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
    slug: 'pjm-load-forecasting',
    title: 'Load forecasting for a power trading desk',
    subtitle: 'Five Dimensions Energy · Quantitative Analyst Intern · Princeton, NJ',
    year: '2026',
    tags: ['time series forecasting', 'power markets', 'uncertainty', 'production ML'],
    highlights: [
      'Improved the day-ahead demand forecast the desk uses for PJM retail supply auctions, mainly with weather and calendar features that change with the season. It did better for 15 of 16 utilities across two held-out years and went into production.',
      'Built and deployed a real-time forecast for all 20 PJM zones. It predicts hourly load 14 days out, updates four times a day, comes with 90% uncertainty bands, and beat PJM’s own published forecast in every zone.',
      'Mapped about 2,680 U.S. data centers to grid zones using regulatory and utility territory data. All 120 that I checked against independent records were right. I also set up an LLM pipeline that pulls capacity numbers out of the news, with a person reviewing every result.',
      'Ran about 15 planned experiments and compared 1,500 deep learning setups (LSTM, GRU, TFT). About two thirds of the ideas didn’t hold up, and I wrote those up as carefully as the ones that did.'
    ],
    summary:
      'I spent the summer on the load forecasting desk at Five Dimensions Energy, a power trading firm in the PJM market, and ran four projects on my own. The details stay with the firm, so this is the overview.'
  },
  {
    slug: 'gentari-renewables-ml',
    title: 'Solar forecasting and automation at Gentari',
    subtitle: 'Gentari (PETRONAS) · Data Scientist, then Senior Data Scientist · Gurgaon, India',
    year: '2023–2025',
    tags: ['deep learning', 'solar forecasting', 'RAG', 'automation', 'MLOps'],
    highlights: [
      'Built a bidirectional LSTM solar forecast with some new weather inputs. It beat the vendor forecast we were paying for, so it became our in-house forecast.',
      'Built a private RAG chatbot with FAISS and a local Llama model, so analysts could find answers faster without us paying for API calls. I also led a solar forecasting project with Microsoft on Azure and mentored two interns.',
      'Automated the power injection uploads to government portals for 40 solar and wind plants, which saved about 100 hours of manual work a week. I also deployed an LSTM model that flags inverter faults across our solar sites.'
    ],
    summary:
      'Two years as a data scientist at Gentari, the clean energy company of PETRONAS. I was promoted to senior in 2024.'
  },
  {
    slug: 'grid-scout',
    title: 'Grid-Scout',
    subtitle: 'Where should a gigawatt data center plug into the grid?',
    year: '2025',
    tags: ['optimization', 'energy systems', 'web app', 'geospatial'],
    hero: {
      kind: 'video',
      src: '/media/gridscout_hero.mp4',
      poster: '/media/gridscout_poster.jpg',
      alt: 'Grid-Scout demo'
    },
    highlights: [
      'Scores U.S. locations on transmission headroom, distance to clean generation, reliability, and emissions.',
      'An interactive map for comparing candidate sites side by side.'
    ],
    summary:
      'Built at the MIT Energy Hackathon. It helps pick where very large loads like data centers should connect, so they add less congestion and fewer emissions.'
  },
  {
    slug: 'mcp-aero-design',
    title: 'AI agents for aircraft design',
    subtitle: 'Boeing-funded research at CMU’s Design Research Collective',
    year: '2025–now',
    tags: ['AI agents', 'MCP', 'CFD', 'tooling'],
    hero: {
      kind: 'image',
      src: '/media/boeing.jpg',
      alt: 'Boeing-funded project'
    },
    highlights: [
      'Building the layer that lets an agent call several MCP servers, for geometry, CFD, and engine sizing, as steps in one workflow.',
      'Making the tools dependable for agents with strict schemas, separate sessions, structured JSON output, and repeatable test runs.'
    ],
    summary:
      'Research on letting AI agents drive real engineering tools. It’s under NDA, so I can only share the outline.'
  },
  {
    slug: 'ai-coach-slack-bot',
    title: 'AI Coach',
    subtitle: 'A Slack bot that keeps group discussions on track',
    year: '2026',
    tags: ['AI agents', 'Slack API', 'AWS Lambda', 'DynamoDB', 'LLMs'],
    highlights: [
      'Notices when a couple of people dominate, when the topic drifts, or when the channel goes quiet, and posts a short nudge.',
      'Runs on API Gateway, Lambda, and DynamoDB. It deduplicates Slack events, keeps a rolling window of recent messages, and stores a separate OAuth token for each workspace.',
      'The thresholds are configurable, so whoever runs it decides when and how often it steps in.',
      'Deploys with one SAM command, including the OAuth flow and Slack signature checks.'
    ],
    summary:
      'A Slack bot that watches how a group conversation is going and nudges it when it needs it. It runs serverless on AWS and can serve several Slack workspaces at once.'
  },
  {
    slug: 'adversarial-robust-autonomy',
    title: 'Making a self-driving demo harder to fool',
    subtitle: 'Raspberry Pi and Arduino hardware prototype',
    year: '2022',
    tags: ['computer vision', 'robustness', 'robotics', 'prototype'],
    hero: {
      kind: 'image',
      src: '/media/prototype_1.jpg',
      alt: 'Autonomous driving robustness prototype'
    },
    links: [
      {
        label: 'Read the paper',
        href: 'https://www.researchgate.net/publication/370587091_Structure-Based_Learning_for_Robust_Defense_Against_Adversarial_Attacks_in_Autonomous_Driving_Agents'
      }
    ],
    highlights: [
      'Found ways that small, deliberate changes to the input could fool the driving model, then tested defenses against them.',
      'Built the hardware prototype with onboard compute and sensors and ran it through controlled test scenarios.'
    ],
    summary:
      'A hardware demo that goes with my paper on defending driving models against adversarial attacks.'
  }
]

export const moreProjects: Project[] = [
  {
    slug: 'fifa-analytics',
    title: 'FIFA player analytics',
    subtitle: 'GCP, Spark, PostgreSQL',
    year: '2026',
    tags: ['GCP', 'Spark', 'PostgreSQL', 'ML pipeline'],
    highlights: [
      'Loads eight seasons of player data (2015–2022), fixes the schema differences between years, and stores it all in PostgreSQL.',
      'Trains and compares several models with Spark MLlib and deep learning on GCP to predict player value and rating.'
    ],
    summary: 'A cloud data pipeline and a set of models built on eight seasons of FIFA player data.'
  },
  {
    slug: 'private-rag-chatbot',
    title: 'Private RAG chatbot',
    subtitle: 'FAISS and a local Llama model',
    year: '2024–2025',
    tags: ['RAG', 'FAISS', 'LLM', 'enterprise'],
    highlights: [
      'Answers questions from internal documents using FAISS for retrieval and a Llama model running locally, so nothing goes to an outside API.',
      'Shipped as an internal tool for analysts. I mentored the interns who helped build it.'
    ],
    summary: 'An internal assistant at Gentari that was faster and cheaper than calling a hosted model.'
  },
  {
    slug: 'bearing-fault-vit',
    title: 'Bearing fault detection',
    subtitle: 'Vision Transformers on noisy vibration data',
    year: '2022–2023',
    tags: ['signal processing', 'ViT', 'robust ML'],
    hero: {
      kind: 'image',
      src: '/media/bearing.jpg',
      alt: 'Bearing faults'
    },
    links: [
      {
        label: 'Read the paper',
        href: 'https://ieeexplore.ieee.org/document/10306508/'
      }
    ],
    highlights: [
      'Paired Vision Transformers with complex-frequency features so the model still works when the vibration signal is noisy.',
      'Published at ICCCNT 2023 (IEEE), with a second paper accepted at ICAET 2023.'
    ],
    summary: 'My undergrad thesis at NSUT, on spotting bearing faults from vibration signals.'
  }
]

// The three cards at the top of the home page. Every number here also
// appears in the project write-ups above, so keep them in sync.
export type SelectedWork = {
  slug: string
  kicker: string
  metric: string
  metricLabel: string
  result: string
}

export const selectedWork: SelectedWork[] = [
  {
    slug: 'pjm-load-forecasting',
    kicker: 'Five Dimensions Energy · 2026',
    metric: '20 of 20',
    metricLabel: 'PJM zones where my forecast beat the grid operator’s',
    result:
      'A real-time load forecast for every PJM zone. It updates four times a day and looks two weeks ahead. I also improved the day-ahead model the desk uses for supply auctions.'
  },
  {
    slug: 'gentari-renewables-ml',
    kicker: 'Gentari · 2023–2025',
    metric: '~100 hrs',
    metricLabel: 'of manual work saved each week across 40 plants',
    result:
      'Automated portal uploads for 40 solar and wind plants. I also replaced a vendor’s solar forecast with our own, more accurate one, and built a private chatbot for the analysts.'
  },
  {
    slug: 'mcp-aero-design',
    kicker: 'CMU research · Boeing funded',
    metric: '3 tools',
    metricLabel: 'geometry, CFD, and engine sizing, wired up for AI agents',
    result:
      'I’m building the layer that lets an agent run aircraft design tools through MCP. It’s under NDA, so this is the short version.'
  }
]
