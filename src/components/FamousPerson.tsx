'use client'

import type { FamousPerson as FamousPersonType } from '@/lib/types'
import { CATEGORY_COLORS } from '@/lib/types'
import { t, getLocalizedFamous } from '@/lib/i18n'
import type { Lang } from '@/lib/i18n'

interface FamousPersonProps {
  person: FamousPersonType
  userAge: number
  lang?: Lang
}

export default function FamousPerson({ person, userAge, lang = 'ko' }: FamousPersonProps) {
  const categoryColor = CATEGORY_COLORS[person.category]
  const ageDiff = userAge - person.age
  const localized = getLocalizedFamous(person, lang)

  return (
    <div className="relative bg-[#F5F5F5] rounded-2xl p-5 overflow-hidden">
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
        style={{ backgroundColor: categoryColor }}
      />
      <div className="space-y-2 pl-2">
        <p className="text-xs text-[#A0A0A0]">
          {t('famous_at_your_age', lang, userAge)}
        </p>
        <p className="text-[#1A1A1A] text-base leading-relaxed">
          <span className="font-semibold" style={{ fontFamily: 'var(--font-jakarta)' }}>
            {localized.name}
          </span>
          <span className="text-[#6B6B6B]">{t('famous_suffix', lang)}</span>
        </p>
        <p className="text-[#1A1A1A] text-base font-medium">
          {localized.achievement}
        </p>
        {ageDiff > 0 && (
          <p className="text-xs text-[#A0A0A0] pt-1">
            {t('famous_years_ago', lang, person.age, ageDiff)}
          </p>
        )}
        {ageDiff < 0 && (
          <p className="text-xs text-[#A0A0A0] pt-1">
            {t('famous_years_left', lang, person.age, Math.abs(ageDiff))}
          </p>
        )}
        {ageDiff === 0 && (
          <p className="text-xs font-medium pt-1" style={{ color: categoryColor }}>
            {t('famous_right_now', lang)}
          </p>
        )}
      </div>
    </div>
  )
}
