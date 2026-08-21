'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

type Entry = { word: string; meaning: string; hints: [string, string, string] }

const WORDS: Entry[] = [
  {
    word: 'AGENT',
    meaning: 'Software that perceives, decides, and acts toward a goal on its own.',
    hints: ['It does things so you do not have to', 'Every AI company is building one right now', 'My Boeing project is full of them']
  },
  {
    word: 'TOKEN',
    meaning: 'The chunk of text an LLM actually reads and writes.',
    hints: ['LLMs bill you by this', 'A word is roughly 1.3 of these', 'Context windows are measured in these']
  },
  {
    word: 'CACHE',
    meaning: 'Fast memory that keeps recent answers close so you never compute twice.',
    hints: ['Hit or miss, literally', 'Clearing it fixes half of all bugs', 'Pronounced like money']
  },
  {
    word: 'MODEL',
    meaning: 'A learned mapping from inputs to predictions. Trained, not written.',
    hints: ['Weights and biases live inside it', 'You fit it, then you ship it', 'The thing you play against in my forecast game']
  },
  {
    word: 'EPOCH',
    meaning: 'One full pass through the training data.',
    hints: ['Training time is measured in these', 'Too many of these and you overfit', 'Also a unit of geological time']
  },
  {
    word: 'LAYER',
    meaning: 'One stage of a neural network. Deep learning is just many of these.',
    hints: ['Networks stack these', 'Attention lives inside every one', 'Onions have them too']
  },
  {
    word: 'QUERY',
    meaning: 'A structured question asked of data.',
    hints: ['SQL is built around these', 'Databases answer them', 'Also what you type into a search bar']
  },
  {
    word: 'ASYNC',
    meaning: 'Code that starts work and does not wait around for it to finish.',
    hints: ['JavaScript’s favorite adjective', 'It pairs with await', 'Non blocking by design']
  },
  {
    word: 'REGEX',
    meaning: 'A pattern language for matching text. Write once, read never.',
    hints: ['Famous for solving one problem and creating two', 'Full of backslashes', 'Short for regular expression']
  },
  {
    word: 'STACK',
    meaning: 'The set of technologies a product is built on.',
    hints: ['Full ___ engineer', 'Overflow errors happen to it', 'A famous Q&A site is named after it']
  },
  {
    word: 'CLOUD',
    meaning: 'Computers you rent instead of own.',
    hints: ['AWS, Azure, GCP', 'It is just someone else’s computer', 'Where this site is deployed']
  },
  {
    word: 'SHELL',
    meaning: 'The command line interpreter between you and the machine.',
    hints: ['bash and zsh are two of them', 'Scripts run inside it', 'Also found on a beach']
  },
  {
    word: 'MERGE',
    meaning: 'Combining two branches of work into one. Git’s moment of truth.',
    hints: ['Conflicts happen here', 'Two branches become one', 'The button at the bottom of a pull request']
  },
  {
    word: 'DEBUG',
    meaning: 'Finding out why the code does that. Roughly 90% of programming.',
    hints: ['Named after an actual moth', 'print() is the oldest tool for it', 'You do it more than you write']
  },
  {
    word: 'PROXY',
    meaning: 'A server that stands between you and the internet.',
    hints: ['The middleman of networking', 'It hides where requests come from', 'Fighting a war by one is a common phrase']
  },
  {
    word: 'INFER',
    meaning: 'Running a trained model forward. Training’s cheaper sibling.',
    hints: ['What GPUs do in production', 'Conclusions drawn from evidence', 'The ence version is a billion dollar market']
  },
  {
    word: 'PIXEL',
    meaning: 'The smallest unit of a screen. Millions of them make an image.',
    hints: ['This game’s entire aesthetic', 'The Chrome dino is made of these', 'Also a phone made by Google']
  },
  {
    word: 'BUILD',
    meaning: 'Turning source code into something runnable.',
    hints: ['CI runs one on every push', 'It fails on Fridays', 'Vercel does one for this site every time I commit']
  },
  {
    word: 'QUEUE',
    meaning: 'A line of work processed first in, first out.',
    hints: ['FIFO by definition', 'Four fifths of it is silent', 'Messages wait in one']
  },
  {
    word: 'BATCH',
    meaning: 'A group of items processed together instead of one at a time.',
    hints: ['Gradient descent comes in mini versions of this', 'The opposite of streaming', 'Cookies are also made in one']
  },
  {
    word: 'PARSE',
    meaning: 'Reading structure out of raw text.',
    hints: ['What every compiler does first', 'JSON dot ___', 'Turning strings into meaning']
  },
  {
    word: 'ARRAY',
    meaning: 'An ordered block of values, indexed from zero.',
    hints: ['Starts counting at zero', 'NumPy’s favorite object', 'Out of bounds errors live here']
  },
  {
    word: 'CLASS',
    meaning: 'A blueprint for objects in object oriented programming.',
    hints: ['It has methods', 'Python and Java both start objects here', 'Also where students sit']
  },
  {
    word: 'LOGIC',
    meaning: 'The rules of reasoning every program is built on.',
    hints: ['Gates are made of it', 'AND, OR, NOT', 'Spock’s favorite subject']
  },
  {
    word: 'INPUT',
    meaning: 'Whatever goes into a system before it becomes output.',
    hints: ['Garbage in, garbage out starts here', 'Forms collect it', 'The I in I/O']
  },
  {
    word: 'LINUX',
    meaning: 'The open source OS running most of the internet.',
    hints: ['A penguin is its mascot', 'Torvalds wrote the first version', 'Every server you have ever used probably runs it']
  },
  {
    word: 'REACT',
    meaning: 'The UI library behind half the modern web, including this site.',
    hints: ['Components and hooks', 'Made at Facebook', 'This very page is built with it']
  },
  {
    word: 'ROBOT',
    meaning: 'A machine that senses, decides, and acts in the physical world.',
    hints: ['Asimov wrote laws for them', 'txt file that tells crawlers what to skip', 'I built a small autonomous one at IIT Kharagpur']
  },
  {
    word: 'MACRO',
    meaning: 'Code that writes or replays code. A recorded shortcut.',
    hints: ['Excel power users love them', 'The opposite of micro', 'C programmers define them with a hash']
  },
  {
    word: 'PATCH',
    meaning: 'A small fix shipped fast.',
    hints: ['Tuesday is named after it', 'Version numbers end with one', 'What you apply to a vulnerability']
  },
  {
    word: 'LOGIN',
    meaning: 'Proving to a system that you are you.',
    hints: ['Username plus password', 'The page before everything else', 'You fail it three times and get locked out']
  },
  {
    word: 'EMAIL',
    meaning: 'The internet’s oldest killer app. Still undefeated.',
    hints: ['Has an @ in the middle', 'Reply all is its greatest danger', 'Older than the web itself']
  },
  {
    word: 'VIRUS',
    meaning: 'Code that copies itself into places it was never invited.',
    hints: ['Spreads by itself', 'Antivirus is named after it', 'Also a biology term']
  },
  {
    word: 'CRASH',
    meaning: 'When a program stops abruptly and takes your unsaved work with it.',
    hints: ['Blue screens announce it', 'Segfaults cause it', 'Also what markets do']
  },
  {
    word: 'BLOCK',
    meaning: 'A batch of transactions chained to the previous one. Also a unit of storage.',
    hints: ['Chain them and you get a buzzword', 'Miners compete to add one', 'Tetris is made of them']
  },
  {
    word: 'GRAPH',
    meaning: 'Nodes and edges. The shape of every network.',
    hints: ['Social networks are one', 'Neural nets are computational ones', 'BFS and DFS walk them']
  },
  {
    word: 'SCALE',
    meaning: 'Handling ten times the load without ten times the pain.',
    hints: ['Horizontal or vertical', 'The hard part of every startup', 'Also found on fish']
  },
  {
    word: 'TRAIN',
    meaning: 'Teaching a model by showing it data until it stops being wrong.',
    hints: ['GPUs burn for this', 'Comes before test and validation', 'Also runs on rails']
  },
  {
    word: 'LABEL',
    meaning: 'The ground truth a supervised model learns from.',
    hints: ['Supervised learning needs them', 'Humans annotate them', 'Also found on soup cans']
  },
  {
    word: 'DRONE',
    meaning: 'A flying robot with a camera and opinions about wind.',
    hints: ['Quadcopters are the common kind', 'Delivery companies keep promising them', 'I wrote a takeoff model for one at IIT Kharagpur']
  }
]

type Status = 'g' | 'y' | 'x'

function evaluate(guess: string, answer: string): Status[] {
  const res: Status[] = Array(5).fill('x')
  const remaining: Record<string, number> = {}
  for (let i = 0; i < 5; i++) {
    if (guess[i] === answer[i]) {
      res[i] = 'g'
    } else {
      remaining[answer[i]] = (remaining[answer[i]] || 0) + 1
    }
  }
  for (let i = 0; i < 5; i++) {
    if (res[i] !== 'g' && remaining[guess[i]] > 0) {
      res[i] = 'y'
      remaining[guess[i]] -= 1
    }
  }
  return res
}

const tileClass: Record<Status, string> = {
  g: 'border-emerald-400/60 bg-emerald-500/70 text-white',
  y: 'border-yellow-400/60 bg-yellow-500/60 text-white',
  x: 'border-white/10 bg-white/[0.06] text-white/45'
}

const keyClass: Record<Status, string> = {
  g: 'bg-emerald-500/70 text-white',
  y: 'bg-yellow-500/60 text-white',
  x: 'bg-white/[0.04] text-white/30'
}

const KEY_ROWS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM']

export function TechWordle() {
  const [entry, setEntry] = useState<Entry | null>(null)
  const [rows, setRows] = useState<string[]>([])
  const [current, setCurrent] = useState('')
  const [done, setDone] = useState<'won' | 'lost' | null>(null)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)

  const newGame = () => {
    const last = localStorage.getItem('tw-last')
    const pool = WORDS.filter((w) => w.word !== last)
    const pick = pool[Math.floor(Math.random() * pool.length)]
    localStorage.setItem('tw-last', pick.word)
    setEntry(pick)
    setRows([])
    setCurrent('')
    setDone(null)
  }

  useEffect(() => {
    setStreak(parseInt(localStorage.getItem('tw-streak') || '0', 10))
    setBestStreak(parseInt(localStorage.getItem('tw-best') || '0', 10))
    newGame()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const commitResult = (won: boolean) => {
    const s = won ? streak + 1 : 0
    setStreak(s)
    localStorage.setItem('tw-streak', String(s))
    if (s > bestStreak) {
      setBestStreak(s)
      localStorage.setItem('tw-best', String(s))
    }
  }

  const press = (key: string) => {
    if (!entry || done) return
    if (key === 'ENTER') {
      if (current.length !== 5) return
      const next = [...rows, current]
      setRows(next)
      setCurrent('')
      if (current === entry.word) {
        setDone('won')
        commitResult(true)
      } else if (next.length >= 6) {
        setDone('lost')
        commitResult(false)
      }
      return
    }
    if (key === 'BACK') {
      setCurrent((c) => c.slice(0, -1))
      return
    }
    if (/^[A-Z]$/.test(key) && current.length < 5) {
      setCurrent((c) => c + key)
    }
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      const el = document.activeElement
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) return
      if (e.key === 'Enter') press('ENTER')
      else if (e.key === 'Backspace') press('BACK')
      else if (/^[a-zA-Z]$/.test(e.key)) press(e.key.toUpperCase())
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  if (!entry) return <div className="min-h-[300px]" />

  const keyStatus: Record<string, Status> = {}
  rows.forEach((r) => {
    const ev = evaluate(r, entry.word)
    for (let i = 0; i < 5; i++) {
      const l = r[i]
      const s = ev[i]
      if (s === 'g' || (s === 'y' && keyStatus[l] !== 'g') || (s === 'x' && !keyStatus[l])) {
        keyStatus[l] = s
      }
    }
  })

  const hintCount = done ? 0 : Math.max(0, rows.length - 2)

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2 font-pixel text-[9px]">
        <span className="rounded border border-white/15 bg-white/5 px-2.5 py-1.5 text-white/60">
          STREAK {streak}
        </span>
        <span className="rounded border border-white/15 bg-white/5 px-2.5 py-1.5 text-white/40">
          BEST {bestStreak}
        </span>
        <span className="text-white/30">GUESS THE TECH WORD</span>
      </div>

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-8">
        <div className="grid grid-rows-6 gap-1.5">
          {Array.from({ length: 6 }, (_, r) => {
            const submitted = rows[r]
            const isCurrent = r === rows.length && !done
            const letters = submitted ?? (isCurrent ? current : '')
            const ev = submitted ? evaluate(submitted, entry.word) : null
            return (
              <div key={r} className="grid grid-cols-5 gap-1.5">
                {Array.from({ length: 5 }, (_, c) => (
                  <div
                    key={c}
                    className={`flex h-11 w-11 items-center justify-center rounded border font-pixel text-sm sm:h-12 sm:w-12 ${
                      ev ? tileClass[ev[c]] : letters[c] ? 'border-white/30 bg-white/10 text-white' : 'border-white/10 bg-transparent'
                    }`}
                  >
                    {letters[c] ?? ''}
                  </div>
                ))}
              </div>
            )
          })}
        </div>

        <div className="w-full max-w-sm flex-1 space-y-3">
          {done ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <p className="font-pixel text-[10px] text-white/50">
                {done === 'won' ? 'SOLVED' : 'OUT OF TRIES'}
              </p>
              <p className="mt-2 font-pixel text-lg text-accent">{entry.word}</p>
              <p className="mt-2 text-sm leading-relaxed text-white/70">{entry.meaning}</p>
              <button
                type="button"
                onClick={newGame}
                className="mt-4 rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:opacity-90"
              >
                New word
              </button>
            </motion.div>
          ) : hintCount > 0 ? (
            <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-4">
              <p className="font-pixel text-[9px] text-yellow-300/70">HINTS INCOMING</p>
              <ul className="mt-2 space-y-1.5 text-sm text-white/70">
                {entry.hints.slice(0, Math.min(hintCount, 3)).map((h) => (
                  <li key={h}>→ {h}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-sm text-white/55">
              A five letter word from the world of tech and AI. Six tries. Hints start dropping after your third miss. Type or tap.
            </p>
          )}

          <div className="space-y-1.5">
            {KEY_ROWS.map((row, ri) => (
              <div key={row} className="flex justify-center gap-1 sm:justify-start">
                {ri === 2 ? (
                  <button
                    type="button"
                    onClick={() => press('ENTER')}
                    className="rounded bg-white/10 px-2 py-2.5 font-pixel text-[8px] text-white/70 transition hover:bg-white/20"
                  >
                    ENT
                  </button>
                ) : null}
                {row.split('').map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => press(k)}
                    className={`w-7 rounded py-2.5 font-pixel text-[10px] transition hover:bg-white/20 sm:w-8 ${
                      keyStatus[k] ? keyClass[keyStatus[k]] : 'bg-white/10 text-white/80'
                    }`}
                  >
                    {k}
                  </button>
                ))}
                {ri === 2 ? (
                  <button
                    type="button"
                    onClick={() => press('BACK')}
                    className="rounded bg-white/10 px-2 py-2.5 font-pixel text-[8px] text-white/70 transition hover:bg-white/20"
                  >
                    DEL
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
