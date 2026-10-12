'use client'

import { useEffect } from 'react'

export function ConsoleEgg() {
  useEffect(() => {
    console.log(
      '%c mayank@desk ~ whoami ',
      'background:#0b1220;color:#2dd4bf;font-family:monospace;font-size:14px;padding:6px 10px;border-radius:6px;'
    )
    console.log(
      '%cHey, you found the console.\n' +
        'Source: https://github.com/Kugel-Blitz-13/mayank-portfolio\n' +
        'Try the Konami code, or the CRT switch on the Off the clock page.\n' +
        'Say hi: mayankdixit132001@gmail.com',
      'color:#9ba4be;font-family:monospace;font-size:12px;line-height:1.7;'
    )
  }, [])
  return null
}
