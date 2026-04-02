'use client'

import { getYearPercentage, getMonthPercentage, getDaysUntilBirthday } from '@/lib/life'

interface ProgressBarsProps {
  birthDate: string
}

interface BarProps {
  label: string
  value: number
  suffix?: string
}

function Bar({ label, value, suffix = '%' }: BarProps) {
  const displayValue = suffix === '%' ? value.toFixed(1) : String(Math.round(value))
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-baseline">
        <span className="text-xs text-[#A0A0A0]">{label}</span>
        <span className="text-sm font-semibold text-[#1A1A1A]" style={{ fontFamily: 'var(--font-jakarta)' }}>
          {displayValue}{suffix}
        </span>
      </div>
      {suffix === '%' && (
        <div className="h-1.5 bg-[#EFEFEF] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${Math.min(value, 100)}%`,
              background: 'linear-gradient(90deg, #7EB8DA, #6BC5A0)',
            }}
          />
        </div>
      )}
    </div>
  )
}

export default function ProgressBars({ birthDate }: ProgressBarsProps) {
  const yearPct = getYearPercentage()
  const monthPct = getMonthPercentage()
  const daysUntilBday = getDaysUntilBirthday(birthDate)

  return (
    <div className="bg-[#F5F5F5] rounded-2xl p-5 space-y-4">
      <p className="text-xs text-[#A0A0A0] uppercase tracking-wider">진행률</p>
      <Bar label="올해" value={yearPct} />
      <Bar label="이번 달" value={monthPct} />
      <Bar label="다음 생일까지" value={daysUntilBday} suffix="일" />
    </div>
  )
}
