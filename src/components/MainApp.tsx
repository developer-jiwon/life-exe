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
  const remainingNewYears = remainingYears
  const remainingBirthdays = remainingYears
  const meetingsPerYear = 5
  const remainingMeetings = remainingYears * meetingsPerYear

  const aligns: Array<'left' | 'center' | 'right'> = ['left', 'right', 'center', 'left', 'right']

  const facts: ParentFact[] = [
    {
      label: `${parent.label}${lang === 'ko' ? '의 나이' : lang === 'ja' ? 'の年齢' : lang === 'zh' ? '的年龄' : lang === 'hi' ? ' की उम्र' : "'s age"}`,
      value: `${parentAge}${lang === 'ko' ? '세' : lang === 'ja' ? '歳' : lang === 'zh' ? '岁' : lang === 'hi' ? ' वर्ष' : ''}`,
      sub: t('life_expectancy', lang, PARENT_LIFE_EXPECTANCY),
      size: 'lg',
      align: aligns[0],
    },
    {
      label: `${parent.label}${lang === 'ko' ? '와 남은 시간' : lang === 'ja' ? 'と残りの時間' : lang === 'zh' ? '剩余的时间' : lang === 'hi' ? ' के साथ बचा समय' : ' — time left'}`,
      value: `~${remainingYears}${t('years', lang)}`,
      sub: remainingYears > 0 ? (lang === 'ko' ? '이 시간은 생각보다 짧습니다' : lang === 'en' ? 'This time is shorter than you think' : lang === 'ja' ? 'この時間は思ったより短い' : lang === 'zh' ? '这段时间比你想的要短' : 'यह समय आपकी सोच से कम है') : undefined,
      size: 'xl',
      align: aligns[1],
    },
    {
      label: `${parent.label}${lang === 'ko' ? '와 보낼 수 있는 설날' : lang === 'en' ? " — New Year's left" : lang === 'ja' ? 'と過ごせる正月' : lang === 'zh' ? '能一起过的新年' : ' — बचे नए साल'}`,
      value: `~${remainingNewYears}${t('times', lang)}`,
      sub: lang === 'ko' ? '매년 당연하지 않은 설날' : lang === 'en' ? 'Each one is not guaranteed' : lang === 'ja' ? '毎年当たり前ではない正月' : lang === 'zh' ? '每一次都不是理所当然' : 'हर बार निश्चित नहीं',
      size: 'md',
      align: aligns[2],
    },
    {
      label: `${parent.label}${lang === 'ko' ? '와 보낼 수 있는 생일' : lang === 'en' ? ' — birthdays left' : lang === 'ja' ? 'と過ごせる誕生日' : lang === 'zh' ? '能一起过的生日' : ' — बचे जन्मदिन'}`,
      value: `~${remainingBirthdays}${t('times', lang)}`,
      sub: lang === 'ko' ? '함께 축하할 수 있는 날들' : lang === 'en' ? 'Days you can celebrate together' : lang === 'ja' ? '一緒にお祝いできる日々' : lang === 'zh' ? '能一起庆祝的日子' : 'साथ मनाने के दिन',
      size: 'md',
      align: aligns[3],
    },
    {
      label: lang === 'ko' ? `1년에 평균 ${meetingsPerYear}번 만난다면` : lang === 'en' ? `If you meet ~${meetingsPerYear}x a year` : lang === 'ja' ? `年平均${meetingsPerYear}回会うなら` : lang === 'zh' ? `如果一年见${meetingsPerYear}次` : `अगर साल में ${meetingsPerYear} बार मिलें`,
      value: lang === 'ko' ? `앞으로 ~${remainingMeetings}번` : `~${remainingMeetings}${t('times', lang)}`,
      sub: `${parent.label}${lang === 'ko' ? '와 만날 수 있는 횟수' : lang === 'en' ? ' — meetings left' : lang === 'ja' ? 'と会える回数' : lang === 'zh' ? '能见面的次数' : ' — बचे मिलने के मौक़े'}`,
      size: 'lg',
      align: aligns[4],
    },
  ]

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
    // 첫 방문(디폴트 생일)이면 바텀시트 자동 오픈
    if (d.birthDate === '1994-04-30' && !localStorage.getItem('life-exe-custom')) {
      setTimeout(() => setSheetOpen(true), 800)
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

  const pct = getLifePercentage(data.birthDate)
  const age = getAge(data.birthDate)
  const days = getDaysLived(data.birthDate)
  const totalDays = getTotalDays(data.birthDate)
  const famous = getFamousPeople(age, 5)
  const facts = getAllFacts(data.birthDate, lang)
  const expectancy = Math.ceil(totalDays / 365)

  // 위인을 팩트 사이에 삽입: 매 6개 팩트마다 1명
  const FAMOUS_ALIGNS: Array<'left' | 'center' | 'right'> = ['left', 'right', 'center', 'left', 'right']

  return (
    <div className="min-h-screen">
      <ScrollBackground birthDate={data.birthDate} />
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
            {t('edit', lang)}
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
          <p className="text-[9px] text-[#999] tracking-widest uppercase">{t('of_your_life', lang)} · {t('life_expectancy', lang, expectancy)}</p>
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
              {t('try_my_birthday', lang)}
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
            {t('share', lang)}
          </button>
        </div>

        {/* Parent section */}
        {!data.parentsSkipped && data.parents && data.parents.length > 0 && (
          <>
            <FullScreenFact align="center">
              <p className="text-[10px] text-[#999] tracking-wider uppercase">for those who matter</p>
              <p className="text-lg font-bold text-[#1A1A1A] mt-0.5" style={{ fontFamily: 'var(--font-jakarta)' }}>
                {lang === 'ko' ? '부모님과 함께할 수 있는 시간' : lang === 'en' ? 'Time left with your parents' : lang === 'ja' ? '親と過ごせる時間' : lang === 'zh' ? '与父母在一起的时间' : 'माता-पिता के साथ बचा समय'}
              </p>
              <p className="text-[11px] text-[#999] mt-1">
                {lang === 'ko' ? '당연한 건 없습니다' : lang === 'en' ? 'Nothing is guaranteed' : lang === 'ja' ? '当たり前のことは何もない' : lang === 'zh' ? '没有什么是理所当然的' : 'कुछ भी निश्चित नहीं है'}
              </p>
            </FullScreenFact>
            {data.parents.map((parent) => {
              const parentFacts = getParentFacts(parent, lang)
              return parentFacts.map((fact, idx) => {
                const sizeClass = { sm: 'text-xl', md: 'text-2xl', lg: 'text-3xl', xl: 'text-4xl' }[fact.size]
                return (
                  <FullScreenFact key={`${parent.label}-${idx}`} align={fact.align}>
                    <p className="text-[11px] text-[#999] mb-0.5">{fact.label}</p>
                    <p className={`${sizeClass} font-bold text-[#1A1A1A] leading-tight`} style={{ fontFamily: 'var(--font-jakarta)' }}>{fact.value}</p>
                    {fact.sub && <p className="text-[11px] text-[#999] mt-0.5">{fact.sub}</p>}
                  </FullScreenFact>
                )
              })
            })}
            <FullScreenFact align="center">
              <p className="text-xs text-[#666]">
                {lang === 'ko' ? '한 번 더 전화해 보세요' : lang === 'en' ? 'Give them a call today' : lang === 'ja' ? 'もう一度電話してみてください' : lang === 'zh' ? '今天给他们打个电话吧' : 'आज उन्हें फ़ोन करें'}
              </p>
              <button
                onClick={() => setParentSheetOpen(true)}
                className="mt-2 text-[10px] text-[#B0B0B0] underline underline-offset-2"
                style={{ fontFamily: 'inherit' }}
              >
                {t('edit', lang)}
              </button>
            </FullScreenFact>
          </>
        )}

        {/* Parent prompt - show when no parents set and not skipped */}
        {!data.parentsSkipped && (!data.parents || data.parents.length === 0) && (
          <FullScreenFact align="center">
            <p className="text-[11px] text-[#999] mb-1">
              {lang === 'ko' ? '부모님과 함께할 수 있는 시간' : lang === 'en' ? 'Time left with your parents' : lang === 'ja' ? '親と過ごせる時間' : lang === 'zh' ? '与父母在一起的时间' : 'माता-पिता के साथ बचा समय'}
            </p>
            <button
              onClick={() => setParentSheetOpen(true)}
              className="w-8 h-8 rounded-full bg-[#F5F5F5] text-[#999] text-lg leading-none active:bg-[#E5E5E5] transition-colors"
              style={{ fontFamily: 'inherit' }}
            >
              +
            </button>
          </FullScreenFact>
        )}

        <footer className="text-center text-[10px] text-[#C0C0C0] pb-8"><p>{t('every_moment', lang)}</p></footer>
      </div>

      <BirthDateSheet open={sheetOpen} onClose={() => setSheetOpen(false)} currentDate={data.birthDate} onSave={handleSave} lang={lang} onLangChange={handleLangChange} />
      <ParentDateSheet open={parentSheetOpen} onClose={() => setParentSheetOpen(false)} currentParents={data.parents} onSave={handleParentSave} />
    </div>
  )
}
