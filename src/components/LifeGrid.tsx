'use client'

import { useRef, useEffect, useCallback, useState } from 'react'
import type { Mood } from '@/lib/types'
import { MOOD_CONFIG } from '@/lib/types'

interface LifeGridProps {
  birthDate: string
  gender?: 'male' | 'female' | 'other'
  pixels: Record<string, Mood>
}

const UNRECORDED = '#D0D0D0'
const FUTURE = 'rgba(0,0,0,0.03)'
const TODAY_BORDER = '#1A1A1A'
const MONTH_LABELS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']

function YearGrid({ year, pixels, birthDate }: { year: number; pixels: Record<string, Mood>; birthDate: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const containerWidth = container.clientWidth
    const cols = 53
    const rows = 7
    const gap = 2
    const labelHeight = 16
    const pixelSize = Math.floor((containerWidth - (cols - 1) * gap) / cols)
    const clampedSize = Math.min(Math.max(pixelSize, 4), 18)

    const canvasWidth = cols * (clampedSize + gap) - gap
    const canvasHeight = rows * (clampedSize + gap) - gap + labelHeight

    const dpr = window.devicePixelRatio || 1
    canvas.width = canvasWidth * dpr
    canvas.height = canvasHeight * dpr
    canvas.style.width = `${canvasWidth}px`
    canvas.style.height = `${canvasHeight}px`
    ctx.scale(dpr, dpr)

    ctx.clearRect(0, 0, canvasWidth, canvasHeight)

    const today = new Date()
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    const birth = new Date(birthDate)

    const jan1 = new Date(year, 0, 1)
    const startDay = jan1.getDay()

    // Draw month labels
    ctx.font = '9px -apple-system, sans-serif'
    ctx.fillStyle = '#A0A0A0'
    ctx.textBaseline = 'top'

    for (let m = 0; m < 12; m++) {
      const firstOfMonth = new Date(year, m, 1)
      const dayOfYear = Math.floor((firstOfMonth.getTime() - jan1.getTime()) / (1000 * 60 * 60 * 24))
      const weekIndex = Math.floor((dayOfYear + startDay) / 7)
      const x = weekIndex * (clampedSize + gap)
      ctx.fillText(MONTH_LABELS[m] + '월', x, 0)
    }

    const gridOffsetY = labelHeight

    for (let week = 0; week < 53; week++) {
      for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        const dayOfYear = week * 7 + dayOfWeek - startDay
        const date = new Date(year, 0, 1 + dayOfYear)

        if (date.getFullYear() !== year) continue

        const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

        const x = week * (clampedSize + gap)
        const y = dayOfWeek * (clampedSize + gap) + gridOffsetY

        let color: string
        if (date > today) {
          color = FUTURE
        } else if (date < birth) {
          color = FUTURE
        } else if (pixels[dateStr]) {
          color = MOOD_CONFIG[pixels[dateStr]].color
        } else {
          color = UNRECORDED
        }

        const radius = Math.max(1.5, clampedSize * 0.2)
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.roundRect(x, y, clampedSize, clampedSize, radius)
        ctx.fill()

        // Today: thicker border + slight glow
        if (dateStr === todayStr) {
          ctx.strokeStyle = TODAY_BORDER
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.roundRect(x - 1, y - 1, clampedSize + 2, clampedSize + 2, radius + 0.5)
          ctx.stroke()
        }
      }
    }
  }, [year, pixels, birthDate])

  useEffect(() => {
    draw()
    window.addEventListener('resize', draw)
    return () => window.removeEventListener('resize', draw)
  }, [draw])

  return (
    <div ref={containerRef} className="w-full overflow-x-auto">
      <canvas ref={canvasRef} className="block mx-auto" />
    </div>
  )
}

function LifeBar({ birthDate, gender, pixels }: LifeGridProps) {
  const birth = new Date(birthDate)
  const today = new Date()
  const birthYear = birth.getFullYear()
  const currentYear = today.getFullYear()
  const expectancy = gender === 'female' ? 86 : gender === 'male' ? 80 : 83
  const endYear = birthYear + expectancy

  const years: { year: number; color: string }[] = []
  for (let y = birthYear; y <= endYear; y++) {
    const yearPixels = Object.entries(pixels).filter(([k]) => k.startsWith(`${y}-`))
    if (yearPixels.length === 0) {
      if (y < currentYear) {
        years.push({ year: y, color: UNRECORDED })
      } else if (y === currentYear) {
        years.push({ year: y, color: '#A0A0A0' })
      } else {
        years.push({ year: y, color: FUTURE })
      }
    } else {
      const counts: Record<string, number> = {}
      yearPixels.forEach(([, mood]) => {
        counts[mood] = (counts[mood] || 0) + 1
      })
      const topMood = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] as Mood
      years.push({ year: y, color: MOOD_CONFIG[topMood].color })
    }
  }

  const livedYears = currentYear - birthYear
  const totalYears = endYear - birthYear

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline">
        <p className="text-xs text-[#A0A0A0]">인생 타임라인</p>
        <p className="text-[10px] text-[#A0A0A0]">{livedYears}년 / {totalYears}년</p>
      </div>
      <div className="flex gap-[1px] items-center">
        {years.map(({ year, color }) => (
          <div
            key={year}
            className="flex-1 rounded-[1px]"
            style={{
              height: year === currentYear ? 12 : 8,
              backgroundColor: color,
              border: year === currentYear ? '1.5px solid #1A1A1A' : 'none',
              borderRadius: 2,
            }}
            title={`${year}년`}
          />
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-[#B0B0B0]">
        <span>{birthYear}</span>
        <span>{endYear}</span>
      </div>
    </div>
  )
}

export default function LifeGrid({ birthDate, gender, pixels }: LifeGridProps) {
  const currentYear = new Date().getFullYear()
  const [viewYear, setViewYear] = useState(currentYear)

  const moodCounts = Object.entries(pixels)
    .filter(([k]) => k.startsWith(`${viewYear}-`))
    .reduce<Record<string, number>>((acc, [, v]) => {
      acc[v] = (acc[v] || 0) + 1
      return acc
    }, {})

  const totalRecorded = Object.values(moodCounts).reduce((a, b) => a + b, 0)

  return (
    <div className="space-y-5">
      {/* Year grid card */}
      <div className="bg-[#F5F5F5] rounded-2xl p-4 space-y-3">
        {/* Year selector */}
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={() => setViewYear(v => v - 1)}
            className="w-8 h-8 flex items-center justify-center rounded-full text-[#A0A0A0] text-base active:bg-[#E5E5E5] transition-colors"
            style={{ fontFamily: 'inherit' }}
          >
            {'<'}
          </button>
          <span className="text-base font-bold text-[#1A1A1A] min-w-[50px] text-center" style={{ fontFamily: 'var(--font-jakarta)' }}>
            {viewYear}
          </span>
          <button
            onClick={() => setViewYear(v => Math.min(v + 1, currentYear))}
            disabled={viewYear >= currentYear}
            className="w-8 h-8 flex items-center justify-center rounded-full text-[#A0A0A0] text-base active:bg-[#E5E5E5] transition-colors disabled:opacity-20"
            style={{ fontFamily: 'inherit' }}
          >
            {'>'}
          </button>
        </div>

        {/* Grid */}
        <YearGrid year={viewYear} pixels={pixels} birthDate={birthDate} />

        {/* Mood legend + count */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex gap-2 flex-wrap">
            {Object.entries(MOOD_CONFIG).map(([mood, config]) => {
              const count = moodCounts[mood] || 0
              if (count === 0) return null
              return (
                <div key={mood} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: config.color }} />
                  <span className="text-[10px] text-[#6B6B6B]">{config.label} {count}</span>
                </div>
              )
            })}
          </div>
          {totalRecorded > 0 && (
            <span className="text-[10px] text-[#A0A0A0]">{totalRecorded}일 기록</span>
          )}
        </div>
      </div>

      {/* Life timeline */}
      <LifeBar birthDate={birthDate} gender={gender} pixels={pixels} />
    </div>
  )
}
