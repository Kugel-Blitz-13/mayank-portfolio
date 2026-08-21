'use client'

import { useEffect } from 'react'

export function ConsoleEgg() {
  useEffect(() => {
    console.log(
      '%c mayank@desk ~ whoami ',
      'background:#0b1220;color:#2dd4bf;font-family:monospace;font-size:14px;padding:6px 10px;border-radius:6px;'
    )
    console.log(
      '%cYou opened the console. Correct instinct.\n' +
        'Source: https://github.com/Kugel-Blitz-13/mayank-portfolio\n' +
        'There is a Konami code on this page. There is also a CRT switch, bottom right.\n' +
        'Say hi: mayankdixit132001@gmail.com',
      'color:#9ba4be;font-family:monospace;font-size:12px;line-height:1.7;'
    )
  }, [])
  return null
}
