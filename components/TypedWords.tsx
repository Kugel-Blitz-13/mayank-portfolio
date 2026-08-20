'use client'

import { useEffect, useState } from 'react'

export function TypedWords({ words }: { words: string[] }) {
  const [text, setText] = useState(words[0])

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      let word = 0
      const id = setInterval(() => {
        word = (word + 1) % words.length
        setText(words[word])
      }, 2400)
      return () => clearInterval(id)
    }

    let word = 0
    let char = words[0].length
    let deleting = false
    let timer: ReturnType<typeof setTimeout>

    const tick = () => {
      const current = words[word]
      if (!deleting) {
        char += 1
        setText(current.slice(0, char))
        if (char >= current.length) {
          deleting = true
          timer = setTimeout(tick, 1700)
          return
        }
        timer = setTimeout(tick, 62)
      } else {
        char -= 1
        setText(current.slice(0, char))
        if (char <= 0) {
          deleting = false
          word = (word + 1) % words.length
          timer = setTimeout(tick, 350)
          return
        }
        timer = setTimeout(tick, 34)
      }
    }

    timer = setTimeout(tick, 1500)
    return () => clearTimeout(timer)
  }, [words])

  return (
    <span>
      {text}
      <span className="caret text-accent">|</span>
    </span>
  )
}
