'use client'

import { useState, useEffect, useCallback } from 'react'
import type { LifeData } from '@/lib/types'
import { loadData, saveData } from '@/lib/storage'
import { getLifePercentage, getAge, getDaysLived, getTotalDays } from '@/lib/life'
import { getFamousPeople } from '@/lib/famous'
import { getAllFacts } from '@/lib/facts'
import type { FamousPerson } from '@/lib/types'
import CountUp from './CountUp'
import FullScreenFact from './FullScreenFact'
import { BirthDateSheet } from './BottomSheet'
import ScrollBackground from './ScrollBackground'

function Famous({ person, age, align }: { person: FamousPerson; age: number; align: 'left' | 'center' | 'right' }) {
  const diff = age - person.age
  return (
    <FullScreenFact align={align}>
      <p className="text-[10px] text-[#999] tracking-wider uppercase">at your age ({age})</p>
      <p className="text-xl font-bold text-[#1A1A1A] mt-0.5" style={{ fontFamily: 'var(--font-jakarta)' }}>{person.name}</p>
      <p className="text-[13px] text-[#666]">{person.achievement}</p>
      {diff === 0 && <p className="text-[11px] font-semibold text-[#1A1A1A] mt-0.5">Right now. Your age.</p>}
      {diff > 0 && <p className="text-[10px] text-[#999] mt-0.5">{person.age}세 — {diff}년 전</p>}
      {diff < 0 && <p className="text-[10px] text-[#999] mt-0.5">{person.age}세 — 아직 {Math.abs(diff)}년</p>}
    </FullScreenFact>
  )
}

export default function MainApp() {
  const [data, setData] = useState<LifeData | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const [sharedMode, setSharedMode] = useState(false)

  useEffect(() => {
    const d = loadData()

    // URL에 ?b=YYYYMMDD 있으면 그 생일로 보여주기 (공유 링크)
    const params = new URLSearchParams(window.location.search)
    const sharedBirth = params.get('b')
    if (sharedBirth && sharedBirth.length === 8) {
      const formatted = `${sharedBirth.slice(0, 4)}-${sharedBirth.slice(4, 6)}-${sharedBirth.slice(6, 8)}`
      const testDate = new Date(formatted)
      if (!isNaN(testDate.getTime())) {
        setData({ ...d, birthDate: formatted })
        setSharedMode(true)
        return
      }
    }

    setData(d)
    // 첫 방문(디폴트 생일)이면 바텀시트 자동 오픈
    if (d.birthDate === '1994-04-30' && !localStorage.getItem('life-exe-custom')) {
      setTimeout(() => setSheetOpen(true), 800)
    }
  }, [])

  const handleSave = useCallback((date: string) => {
    if (!date || !data) return
    saveData({ ...data, birthDate: date, onboardingDone: true })
    localStorage.setItem('life-exe-custom', 'true')
    setData(loadData())
    setSheetOpen(false)
  }, [data])

  if (!data) return <div className="flex items-center justify-center min-h-screen bg-white"><div className="w-5 h-5 border-2 border-[#E5E5E5] border-t-[#1A1A1A] rounded-full animate-spin" /></div>

  const pct = getLifePercentage(data.birthDate)
  const age = getAge(data.birthDate)
  const days = getDaysLived(data.birthDate)
  const totalDays = getTotalDays(data.birthDate)
  const famous = getFamousPeople(age, 5)
  const facts = getAllFacts(data.birthDate)
  const expectancy = Math.ceil(totalDays / 365)

  // 위인을 팩트 사이에 삽입: 매 6개 팩트마다 1명
  const FAMOUS_ALIGNS: Array<'left' | 'center' | 'right'> = ['left', 'right', 'center', 'left', 'right']

  return (
    <div className="min-h-screen">
      <ScrollBackground />
      <div className="max-w-[600px] mx-auto">

        <header className="flex items-center pt-8 px-5 gap-0">
          <div className="bg-[#1A1A1A] text-white text-xs font-bold px-4 py-2 rounded-t-lg" style={{ fontFamily: 'var(--font-jakarta)' }}>
            Life.exe
          </div>
          <button
            className="bg-[#F0F0F0] text-[#999] text-xs px-4 py-2 rounded-t-lg ml-1 active:bg-[#E5E5E5] transition-colors"
            onClick={() => setSheetOpen(true)}
            style={{ fontFamily: 'var(--font-jakarta)' }}
          >
            Edit
          </button>
          <div className="flex-1" />
        </header>
        <div className="h-px bg-[#E5E5E5] mx-5 mb-2" />

        {/* Hero */}
        <div className="text-center px-5 py-2">
          <div className="flex items-baseline justify-center">
            <span className="text-[48px] font-bold leading-none text-[#1A1A1A]" style={{ fontFamily: 'var(--font-jakarta)' }}><CountUp end={pct} decimals={1} /></span>
            <span className="text-[20px] font-light text-[#C0C0C0] ml-0.5" style={{ fontFamily: 'var(--font-jakarta)' }}>%</span>
          </div>
          <p className="text-[9px] text-[#999] tracking-widest uppercase">of your life · 기대수명 {expectancy}세 기준</p>
          <div className="mt-1 w-28 mx-auto h-[2px] bg-[#F0F0F0] rounded-full overflow-hidden">
            <div className="h-full bg-[#1A1A1A] rounded-full transition-all duration-[2s]" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {facts.map((fact, idx) => {
          const sizeClass = { sm: 'text-xl', md: 'text-2xl', lg: 'text-3xl', xl: 'text-4xl' }[fact.size]
          const famousIdx = Math.floor(idx / 6)
          const showFamous = idx > 0 && idx % 6 === 0 && famousIdx <= famous.length

          return (
            <div key={idx}>
              {showFamous && famousIdx - 1 < famous.length && (
                <Famous person={famous[famousIdx - 1]} age={age} align={FAMOUS_ALIGNS[(famousIdx - 1) % FAMOUS_ALIGNS.length]} />
              )}
              <FullScreenFact align={fact.align}>
                <p className="text-[11px] text-[#999] mb-0.5">{fact.label}</p>
                <p className={`${sizeClass} font-bold text-[#1A1A1A] leading-tight`} style={{ fontFamily: 'var(--font-jakarta)' }}>{fact.value}</p>
                {fact.sub && <p className="text-[11px] text-[#999] mt-0.5">{fact.sub}</p>}
              </FullScreenFact>
            </div>
          )
        })}

        <FullScreenFact align="center">
          <p className="text-4xl font-bold text-[#1A1A1A]" style={{ fontFamily: 'var(--font-jakarta)' }}>오늘</p>
          <p className="text-sm text-[#999] mt-1">1일</p>
          <p className="text-xs text-[#666] mt-2">지금 이 순간도 당신의 인생입니다</p>
        </FullScreenFact>

        <div className="px-5 py-4 space-y-2">
          {sharedMode && (
            <button
              className="w-full h-11 rounded-xl bg-[#1A1A1A] text-white text-sm font-medium active:scale-[0.98] transition-transform"
              style={{ fontFamily: 'inherit' }}
              onClick={() => {
                window.history.replaceState(null, '', window.location.pathname)
                setSharedMode(false)
                const d = loadData()
                setData(d)
                if (!localStorage.getItem('life-exe-custom')) {
                  setTimeout(() => setSheetOpen(true), 300)
                }
              }}
            >
              Try with my birthday
            </button>
          )}
          <button
            className={`w-full h-11 rounded-xl text-sm font-medium active:scale-[0.98] transition-transform ${
              sharedMode ? 'bg-[#F0F0F0] text-[#1A1A1A]' : 'bg-[#1A1A1A] text-white'
            }`}
            style={{ fontFamily: 'inherit' }}
            onClick={() => {
              const bd = data.birthDate.replace(/-/g, '')
              const url = `${window.location.origin}/?b=${bd}`
              const text = `${pct.toFixed(1)}% of my life. ${days.toLocaleString()} days.\n${url}`
              if (navigator.share) {
                navigator.share({ title: 'Life.exe', text, url }).catch(() => {})
              } else {
                navigator.clipboard.writeText(url).then(() => alert('Link copied!')).catch(() => {})
              }
            }}
          >
            Share my life
          </button>
        </div>

        <footer className="text-center text-[10px] text-[#C0C0C0] pb-8"><p>Every moment counts.</p></footer>
      </div>

      <BirthDateSheet open={sheetOpen} onClose={() => setSheetOpen(false)} currentDate={data.birthDate} onSave={handleSave} />
    </div>
  )
}
