import Link from 'next/link'
import { Container } from '@/components/Container'

export default function NotFound() {
  return (
    <main className="pb-20 pt-24">
      <Container>
        <div className="mx-auto max-w-lg rounded-3xl border border-white/10 bg-black/40 p-6 font-mono text-sm leading-7 backdrop-blur-xl">
          <div className="flex items-center gap-1.5 border-b border-white/10 pb-2.5">
            <span className="h-2 w-2 rounded-full bg-red-400/70" />
            <span className="h-2 w-2 rounded-full bg-yellow-400/70" />
            <span className="h-2 w-2 rounded-full bg-green-400/70" />
            <span className="pl-2 text-white/40">mayank@desk ~ locate page</span>
          </div>
          <div className="pt-3 text-white/70">
            <p>
              <span className="text-red-400">&gt;</span> error 404: node not found
            </p>
            <p>
              <span className="text-accent">&gt;</span> this bus is not in the network model
            </p>
            <p>
              <span className="text-accent">&gt;</span> rerouting to a known good node
              <span className="caret text-accent">▊</span>
            </p>
          </div>
          <Link
            href="/"
            className="mt-5 inline-block rounded-full bg-white px-5 py-2 font-sans text-sm font-semibold text-black hover:opacity-90"
          >
            Back to the grid
          </Link>
        </div>
      </Container>
    </main>
  )
}
