'use client'

import type { FamousPerson as FamousPersonType } from '@/lib/types'
import { CATEGORY_COLORS } from '@/lib/types'

interface FamousPersonProps {
  person: FamousPersonType
  userAge: number
}

export default function FamousPerson({ person, userAge }: FamousPersonProps) {
  const categoryColor = CATEGORY_COLORS[person.category]
  const ageDiff = userAge - person.age

  return (
    <div className="relative bg-[#F5F5F5] rounded-2xl p-5 overflow-hidden">
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
        style={{ backgroundColor: categoryColor }}
      />
      <div className="space-y-2 pl-2">
        <p className="text-xs text-[#A0A0A0]">
          당신의 나이({userAge}세)에...
        </p>
        <p className="text-[#1A1A1A] text-base leading-relaxed">
          <span className="font-semibold" style={{ fontFamily: 'var(--font-jakarta)' }}>
            {person.name}
          </span>
          <span className="text-[#6B6B6B]">은(는)</span>
        </p>
        <p className="text-[#1A1A1A] text-base font-medium">
          {person.achievement}
        </p>
        {ageDiff > 0 && (
          <p className="text-xs text-[#A0A0A0] pt-1">
            {person.age}세 — 지금보다 {ageDiff}년 전
          </p>
        )}
        {ageDiff < 0 && (
          <p className="text-xs text-[#A0A0A0] pt-1">
            {person.age}세 — 아직 {Math.abs(ageDiff)}년 남았다
          </p>
        )}
        {ageDiff === 0 && (
          <p className="text-xs font-medium pt-1" style={{ color: categoryColor }}>
            바로 지금 당신의 나이!
          </p>
        )}
      </div>
    </div>
  )
}
