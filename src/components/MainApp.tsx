'use client'

import { useState, useEffect, useCallback } from 'react'
import type { LifeData } from '@/lib/types'
import { loadData, saveData } from '@/lib/storage'
import { getLifePercentage, getAge, getDaysLived, getTotalDays } from '@/lib/life'
import { getFamousPeople } from '@/lib/famous'
import { getAllFacts } from '@/lib/facts'
import type { FamousPerson } from '@/lib/types'
import { t, getLangFromStorage, saveLang, getLocalizedFamous } from '@/lib/i18n'
import type { Lang } from '@/lib/i18n'
import CountUp from './CountUp'
import FullScreenFact from './FullScreenFact'
import { BirthDateSheet, ParentDateSheet } from './BottomSheet'
import ScrollBackground from './ScrollBackground'

const PARENT_LIFE_EXPECTANCY = 83

interface ParentFact {
  label: string
  value: string
  sub?: string
  size: 'sm' | 'md' | 'lg' | 'xl'
  align: 'left' | 'center' | 'right'
}

function getParentFacts(parent: { label: string; date: string }, lang: Lang): ParentFact[] {
  const now = new Date()
  const birth = new Date(parent.date)
  const ageMs = now.getTime() - birth.getTime()
  const parentAge = Math.floor(ageMs / (365.25 * 24 * 60 * 60 * 1000))
  const remainingYears = Math.max(0, PARENT_LIFE_EXPECTANCY - parentAge)

  const meetingsPerYear = 5
  const remainingMeetings = remainingYears * meetingsPerYear
  const mealsLeft = remainingYears * meetingsPerYear * 2
  const phoneCalls = remainingYears * 24
  const tripsLeft = remainingYears
  const p = parent.label
  const ko = lang === 'ko'

  const aligns: Array<'left' | 'center' | 'right'> = ['left', 'right', 'center', 'left', 'right', 'center', 'left', 'right']
  let idx = 0
  const facts: ParentFact[] = []

  function add(label: string, value: string, sub?: string, size: ParentFact['size'] = 'lg') {
    facts.push({ label, value, sub, size, align: aligns[idx % aligns.length] })
    idx++
  }

  add(p, `${parentAge}${ko ? '세' : ''}`, undefined, 'xl')
  add(ko ? `${p}와 남은 시간` : `Time left with ${p}`, `~${remainingYears}${t('years', lang)}`, ko ? '이 시간은 생각보다 짧습니다' : 'Shorter than you think', 'xl')
  add(ko ? `${p}와 보낼 수 있는 설날` : `New Years with ${p}`, `~${remainingYears}${t('times', lang)}`, ko ? '매년 당연하지 않은 설날' : 'Each one matters', 'md')
  add(ko ? `${p}와 보낼 수 있는 생일` : `Birthdays with ${p}`, `~${remainingYears}${t('times', lang)}`, ko ? '함께 축하할 수 있는 날들' : 'Days to celebrate together', 'md')
  add(ko ? `1년에 ${meetingsPerYear}번 만난다면` : `Meeting ${meetingsPerYear}x/year`, `~${remainingMeetings}${t('times', lang)}`, ko ? `${p}와 만날 수 있는 횟수` : `Meetings left`, 'lg')
  add(ko ? `${p}와 함께 할 수 있는 식사` : `Meals with ${p}`, `~${mealsLeft}${ko ? '끼' : ' meals'}`, ko ? '만날 때마다 두 끼씩' : '2 meals per visit', 'md')
  add(ko ? `${p}에게 전화할 수 있는 횟수` : `Calls to ${p}`, `~${phoneCalls}${t('times', lang)}`, ko ? '한 달에 2번이라면' : '2 calls/month', 'lg')
  add(ko ? `${p}와 여행` : `Trips with ${p}`, `~${tripsLeft}${t('times', lang)}`, ko ? '1년에 1번이라면' : 'Once a year', 'md')

  return facts
}

function Famous({ person, age, align, lang }: { person: FamousPerson; age: number; align: 'left' | 'center' | 'right'; lang: Lang }) {
  const diff = age - person.age
  const localized = getLocalizedFamous(person, lang)
  return (
    <FullScreenFact align={align}>
      <p className="text-[10px] text-[#999] tracking-wider uppercase">{t('at_your_age', lang)} ({age})</p>
      <p className="text-xl font-bold text-[#1A1A1A] mt-0.5" style={{ fontFamily: 'var(--font-jakarta)' }}>{localized.name}</p>
      <p className="text-[13px] text-[#666]">{localized.achievement}</p>
      {diff === 0 && <p className="text-[11px] font-semibold text-[#1A1A1A] mt-0.5">{t('right_now', lang)}</p>}
      {diff > 0 && <p className="text-[10px] text-[#999] mt-0.5">{t('years_ago', lang, person.age, diff)}</p>}
      {diff < 0 && <p className="text-[10px] text-[#999] mt-0.5">{t('years_left', lang, person.age, Math.abs(diff))}</p>}
    </FullScreenFact>
  )
}

export default function MainApp() {
  const [data, setData] = useState<LifeData | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [parentSheetOpen, setParentSheetOpen] = useState(false)
  const [lang, setLang] = useState<Lang>('ko')

  const [sharedMode, setSharedMode] = useState(false)

  useEffect(() => {
    setLang(getLangFromStorage())
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
    // 매번 바텀시트 오픈 (인앱 브라우저 호환)
    const openSheet = () => setSheetOpen(true)
    if (document.readyState === 'complete') {
      const t = setTimeout(openSheet, 500)
      return () => clearTimeout(t)
    } else {
      const handler = () => setTimeout(openSheet, 500)
      window.addEventListener('load', handler)
      return () => window.removeEventListener('load', handler)
    }
  }, [])

  const handleLangChange = useCallback((newLang: Lang) => {
    saveLang(newLang)
    setLang(newLang)
  }, [])

  const handleSave = useCallback((date: string) => {
    if (!date || !data) return
    saveData({ ...data, birthDate: date, onboardingDone: true })
    localStorage.setItem('life-exe-custom', 'true')
    setData(loadData())
    setSheetOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [data])

  const handleParentSave = useCallback((parents: { label: string; date: string }[] | null) => {
    if (!data) return
    if (parents === null) {
      // Skip: remove parents, mark as skipped
      const updated = { ...data, parentsSkipped: true }
      delete updated.parents
      saveData(updated)
    } else {
      saveData({ ...data, parents, parentsSkipped: false })
    }
    setData(loadData())
    setParentSheetOpen(false)
  }, [data])

  if (!data) return <div className="flex items-center justify-center min-h-screen bg-white"><div className="w-5 h-5 border-2 border-[#E5E5E5] border-t-[#1A1A1A] rounded-full animate-spin" /></div>

  const pct = getLifePercentage(data.birthDate, lang)
  const age = getAge(data.birthDate)
  const days = getDaysLived(data.birthDate)
  const totalDays = getTotalDays(data.birthDate, lang)
  const famous = getFamousPeople(age, 5)
  const facts = getAllFacts(data.birthDate, lang)
  const expectancy = Math.ceil(totalDays / 365)

  // 위인을 팩트 사이에 삽입: 매 6개 팩트마다 1명
  const FAMOUS_ALIGNS: Array<'left' | 'center' | 'right'> = ['left', 'right', 'center', 'left', 'right']

  return (
    <div>
      <ScrollBackground birthDate={data.birthDate} />
      <div className="max-w-[600px] mx-auto">

        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm">
          <div className="flex items-center pt-3 pb-0 px-5 gap-0 max-w-[600px] mx-auto">
            <div className="bg-[#1A1A1A] text-white text-[11px] font-bold px-3 py-1.5 rounded-t-lg" style={{ fontFamily: 'var(--font-jakarta)' }}>
              Life.exe
            </div>
            {[
              { label: { ko: '수정', en: 'Edit', ja: '編集', zh: '编辑', hi: 'संपादन' }[lang] || 'Edit', onClick: () => setSheetOpen(true) },
              { label: { ko: '공유', en: 'Share', ja: '共有', zh: '分享', hi: 'शेयर' }[lang] || 'Share', onClick: () => {
                const bd = data.birthDate.replace(/-/g, '')
                const url = `${window.location.origin}/?b=${bd}`
                const text = `${pct.toFixed(1)}% of my life. ${days.toLocaleString()} days.\n${url}`
                if (navigator.share) navigator.share({ title: 'Life.exe', text, url }).catch(() => {})
                else navigator.clipboard.writeText(url).then(() => alert('Link copied!')).catch(() => {})
              }},
            ].map((tab, i) => (
              <button
                key={i}
                className="bg-[#F0F0F0] text-[#999] text-[11px] px-3 py-1.5 rounded-t-lg ml-1 active:bg-[#E5E5E5] transition-colors"
                onClick={tab.onClick}
                style={{ fontFamily: 'var(--font-jakarta)' }}
              >
                {tab.label}
              </button>
            ))}
            <div className="flex-1" />
          </div>
          <div className="h-px bg-[#E5E5E5] mx-5" />
        </header>
        <div className="h-4" />

        {/* Hero */}
        <div className="text-center px-5 py-2">
          <div className="flex items-baseline justify-center">
            <span className="text-[48px] font-bold leading-none text-[#1A1A1A]" style={{ fontFamily: 'var(--font-jakarta)' }}><CountUp end={pct} decimals={1} /></span>
            <span className="text-[20px] font-light text-[#C0C0C0] ml-0.5" style={{ fontFamily: 'var(--font-jakarta)' }}>%</span>
          </div>
          <p className="text-[9px] text-[#999] tracking-widest uppercase">{t('of_your_life', lang)} · {t('life_expectancy', lang, expectancy)}</p>
          <div className="mt-1 w-28 mx-auto h-[2px] bg-[#F0F0F0] rounded-full overflow-hidden">
            <div className="h-full bg-[#1A1A1A] rounded-full transition-all duration-[2s]" style={{ width: `${pct}%` }} />
          </div>
          <button
            onClick={() => setSheetOpen(true)}
            className="mt-3 text-[11px] text-[#999] underline underline-offset-2 active:text-[#1A1A1A]"
            style={{ fontFamily: 'var(--font-jakarta)' }}
          >
            {t('try_my_birthday', lang)}
          </button>
        </div>

        {facts.map((fact, idx) => {
          const sizeClass = { sm: 'text-xl', md: 'text-2xl', lg: 'text-3xl', xl: 'text-4xl' }[fact.size]
          const famousIdx = Math.floor(idx / 6)
          const showFamous = idx > 0 && idx % 6 === 0 && famousIdx <= famous.length

          return (
            <div key={idx}>
              {showFamous && famousIdx - 1 < famous.length && (
                <Famous person={famous[famousIdx - 1]} age={age} align={FAMOUS_ALIGNS[(famousIdx - 1) % FAMOUS_ALIGNS.length]} lang={lang} />
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
          <p className="text-4xl font-bold text-[#1A1A1A]" style={{ fontFamily: 'var(--font-jakarta)' }}>{t('today', lang)}</p>
          <p className="text-sm text-[#999] mt-1">{t('today_sub', lang)}</p>
          <p className="text-xs text-[#666] mt-2">{t('today_msg', lang)}</p>
        </FullScreenFact>

        {/* Try my birthday — 항상 표시 */}
        <div className="px-5 py-3 text-center">
          <button
            className="text-[12px] text-[#1A1A1A] font-medium underline underline-offset-2 active:text-[#666]"
            style={{ fontFamily: 'var(--font-jakarta)' }}
            onClick={() => {
              if (sharedMode) {
                window.history.replaceState(null, '', window.location.pathname)
                setSharedMode(false)
                setData(loadData())
              }
              setTimeout(() => setSheetOpen(true), 100)
            }}
          >
            {t('try_my_birthday', lang)}
          </button>
        </div>

        {/* Parent section — Phase 2 */}
        {/* TODO: 부모님 생일 감성 팩트 (남은 시간, 설날, 식사, 전화, 여행) */}

        <footer className="text-center pb-4 space-y-2">
          <p className="text-[10px] text-[#C0C0C0]">{t('every_moment', lang)}</p>
          <div className="flex justify-center gap-4">
            <a href="/privacy" className="text-[9px] text-[#999] hover:text-[#CCC] transition-colors">개인정보처리방침</a>
            <a href="/terms" className="text-[9px] text-[#999] hover:text-[#CCC] transition-colors">이용약관</a>
          </div>
        </footer>
      </div>

      <BirthDateSheet open={sheetOpen} onClose={() => setSheetOpen(false)} currentDate={data.birthDate} onSave={handleSave} lang={lang} onLangChange={handleLangChange} />
    </div>
  )
}
