'use client'

import type { LifeFact } from '@/lib/facts'

const ALIGNMENTS = ['text-left', 'text-right', 'text-center', 'text-left', 'text-right'] as const

export default function FactCard({ fact, index }: { fact: LifeFact; index: number }) {
  const align = ALIGNMENTS[index % ALIGNMENTS.length]

  return (
    <div className={`${align} py-0.5`}>
      <span className="text-[11px] text-[#888888]">{fact.label} </span>
      <span className="text-base font-bold text-[#1A1A1A]" style={{ fontFamily: 'var(--font-jakarta)' }}>
        {fact.value}
      </span>
      {fact.sub && (
        <span className="text-[11px] text-[#999999] ml-1.5">{fact.sub}</span>
      )}
    </div>
  )
}
