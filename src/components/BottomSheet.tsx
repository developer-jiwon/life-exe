'use client'

import { useState, useEffect, useCallback, type ReactNode } from 'react'
import type { Lang } from '@/lib/i18n'
import { t, saveLang } from '@/lib/i18n'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  children: ReactNode
}

export default function BottomSheet({ open, onClose, children }: BottomSheetProps) {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (open) {
      setMounted(true)
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
    } else {
      setVisible(false)
      const t = setTimeout(() => setMounted(false), 300)
      return () => clearTimeout(t)
    }
  }, [open])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{ backgroundColor: 'rgba(0,0,0,' + (visible ? '0.3' : '0') + ')' }}
        onClick={onClose}
      />
      <div
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl transition-transform duration-300 ease-out"
        style={{ transform: visible ? 'translateY(0)' : 'translateY(100%)' }}
      >
        <div className="w-8 h-[3px] bg-[#E0E0E0] rounded-full mx-auto mt-3" />
        <div className="px-6 pt-5 pb-8" style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}>
          {children}
        </div>
      </div>
    </div>
  )
}

interface BirthDateSheetProps {
  open: boolean
  onClose: () => void
  currentDate: string
  onSave: (date: string) => void
  lang: Lang
  onLangChange: (lang: Lang) => void
}

export function BirthDateSheet({ open, onClose, currentDate, onSave, lang, onLangChange }: BirthDateSheetProps) {
  const parts = currentDate.split('-')
  const [year, setYear] = useState(parts[0] || '1994')
  const [month, setMonth] = useState(parts[1] || '04')
  const [day, setDay] = useState(parts[2] || '30')

  useEffect(() => {
    const p = currentDate.split('-')
    if (p.length === 3) { setYear(p[0]); setMonth(p[1]); setDay(p[2]) }
  }, [currentDate])

  const LANGS: { code: Lang; label: string }[] = [
    { code: 'ko', label: '한국어' },
    { code: 'en', label: 'English' },
    { code: 'ja', label: '日本語' },
    { code: 'zh', label: '中文' },
    { code: 'hi', label: 'हिन्दी' },
  ]

  const handleLangSelect = (code: Lang) => {
    saveLang(code)
    onLangChange(code)
  }

  const handleSave = () => {
    const date = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    onSave(date)
  }

  return (
    <BottomSheet open={open} onClose={onClose}>
      <div className="max-w-[360px] mx-auto">
        {/* Language */}
        <p className="text-[11px] text-[#999] tracking-wider uppercase mb-2">language</p>
        <div className="flex gap-1.5 mb-5 flex-wrap">
          {LANGS.map(l => (
            <button
              key={l.code}
              onClick={() => handleLangSelect(l.code)}
              className={`px-3 py-1.5 rounded-full text-[12px] transition-all ${
                lang === l.code
                  ? 'bg-[#1A1A1A] text-white'
                  : 'bg-[#F5F5F5] text-[#999]'
              }`}
              style={{ fontFamily: 'inherit' }}
            >
              {l.label}
            </button>
          ))}
        </div>

        <p className="text-[11px] text-[#999] tracking-wider uppercase mb-3">birthday</p>

        <div className="flex gap-2 items-end">
          {/* Year */}
          <div className="flex-[2]">
            <label className="text-[10px] text-[#B0B0B0] mb-1 block">YEAR</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              min="1920" max="2025"
              className="w-full h-12 text-center text-2xl font-bold text-[#1A1A1A] bg-transparent border-b-2 border-[#1A1A1A] focus:outline-none"
              style={{ fontFamily: 'var(--font-jakarta)' }}
            />
          </div>

          <span className="text-2xl text-[#D0D0D0] font-light pb-2">/</span>

          {/* Month */}
          <div className="flex-1">
            <label className="text-[10px] text-[#B0B0B0] mb-1 block">MM</label>
            <input
              type="number"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              min="1" max="12"
              className="w-full h-12 text-center text-2xl font-bold text-[#1A1A1A] bg-transparent border-b-2 border-[#1A1A1A] focus:outline-none"
              style={{ fontFamily: 'var(--font-jakarta)' }}
            />
          </div>

          <span className="text-2xl text-[#D0D0D0] font-light pb-2">/</span>

          {/* Day */}
          <div className="flex-1">
            <label className="text-[10px] text-[#B0B0B0] mb-1 block">DD</label>
            <input
              type="number"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              min="1" max="31"
              className="w-full h-12 text-center text-2xl font-bold text-[#1A1A1A] bg-transparent border-b-2 border-[#1A1A1A] focus:outline-none"
              style={{ fontFamily: 'var(--font-jakarta)' }}
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full h-11 mt-6 rounded-xl bg-[#1A1A1A] text-white text-sm font-medium active:scale-[0.98] transition-transform"
          style={{ fontFamily: 'inherit' }}
        >
          {t('save', lang)}
        </button>
      </div>
    </BottomSheet>
  )
}

type ParentMode = 'mom' | 'dad' | 'both' | 'skip'

interface ParentDateSheetProps {
  open: boolean
  onClose: () => void
  currentParents?: { label: string; date: string }[]
  onSave: (parents: { label: string; date: string }[] | null) => void
}

function DateInputGroup({ label, year, month, day, setYear, setMonth, setDay }: {
  label: string
  year: string; month: string; day: string
  setYear: (v: string) => void; setMonth: (v: string) => void; setDay: (v: string) => void
}) {
  return (
    <div className="mb-4">
      <p className="text-[11px] text-[#999] tracking-wider uppercase mb-2">{label} 생년월일</p>
      <div className="flex gap-2 items-end">
        <div className="flex-[2]">
          <label className="text-[10px] text-[#B0B0B0] mb-1 block">YEAR</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            min="1920" max="2025"
            className="w-full h-10 text-center text-xl font-bold text-[#1A1A1A] bg-transparent border-b-2 border-[#1A1A1A] focus:outline-none"
            style={{ fontFamily: 'var(--font-jakarta)' }}
          />
        </div>
        <span className="text-xl text-[#D0D0D0] font-light pb-1">/</span>
        <div className="flex-1">
          <label className="text-[10px] text-[#B0B0B0] mb-1 block">MM</label>
          <input
            type="number"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            min="1" max="12"
            className="w-full h-10 text-center text-xl font-bold text-[#1A1A1A] bg-transparent border-b-2 border-[#1A1A1A] focus:outline-none"
            style={{ fontFamily: 'var(--font-jakarta)' }}
          />
        </div>
        <span className="text-xl text-[#D0D0D0] font-light pb-1">/</span>
        <div className="flex-1">
          <label className="text-[10px] text-[#B0B0B0] mb-1 block">DD</label>
          <input
            type="number"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            min="1" max="31"
            className="w-full h-10 text-center text-xl font-bold text-[#1A1A1A] bg-transparent border-b-2 border-[#1A1A1A] focus:outline-none"
            style={{ fontFamily: 'var(--font-jakarta)' }}
          />
        </div>
      </div>
    </div>
  )
}

export function ParentDateSheet({ open, onClose, currentParents, onSave }: ParentDateSheetProps) {
  const [mode, setMode] = useState<ParentMode>('both')

  const getMomDate = useCallback(() => {
    const mom = currentParents?.find(p => p.label === '엄마')
    return mom ? mom.date.split('-') : ['1960', '01', '01']
  }, [currentParents])

  const getDadDate = useCallback(() => {
    const dad = currentParents?.find(p => p.label === '아빠')
    return dad ? dad.date.split('-') : ['1958', '01', '01']
  }, [currentParents])

  const [momYear, setMomYear] = useState('1960')
  const [momMonth, setMomMonth] = useState('01')
  const [momDay, setMomDay] = useState('01')
  const [dadYear, setDadYear] = useState('1958')
  const [dadMonth, setDadMonth] = useState('01')
  const [dadDay, setDadDay] = useState('01')

  useEffect(() => {
    if (open) {
      const m = getMomDate()
      setMomYear(m[0]); setMomMonth(m[1]); setMomDay(m[2])
      const d = getDadDate()
      setDadYear(d[0]); setDadMonth(d[1]); setDadDay(d[2])
      if (currentParents && currentParents.length > 0) {
        const hasM = currentParents.some(p => p.label === '엄마')
        const hasD = currentParents.some(p => p.label === '아빠')
        if (hasM && hasD) setMode('both')
        else if (hasM) setMode('mom')
        else if (hasD) setMode('dad')
      }
    }
  }, [open, currentParents, getMomDate, getDadDate])

  const MODES: { code: ParentMode; label: string }[] = [
    { code: 'mom', label: '엄마' },
    { code: 'dad', label: '아빠' },
    { code: 'both', label: '둘 다' },
    { code: 'skip', label: '건너뛰기' },
  ]

  const handleSave = () => {
    if (mode === 'skip') {
      onSave(null)
      return
    }
    const parents: { label: string; date: string }[] = []
    if (mode === 'mom' || mode === 'both') {
      parents.push({ label: '엄마', date: `${momYear}-${momMonth.padStart(2, '0')}-${momDay.padStart(2, '0')}` })
    }
    if (mode === 'dad' || mode === 'both') {
      parents.push({ label: '아빠', date: `${dadYear}-${dadMonth.padStart(2, '0')}-${dadDay.padStart(2, '0')}` })
    }
    onSave(parents)
  }

  return (
    <BottomSheet open={open} onClose={onClose}>
      <div className="max-w-[360px] mx-auto">
        <p className="text-[13px] font-medium text-[#1A1A1A] mb-1">부모님과 함께할 수 있는 시간</p>
        <p className="text-[11px] text-[#999] mb-4">소중한 시간을 계산해 드릴게요</p>

        <div className="flex gap-1.5 mb-5 flex-wrap">
          {MODES.map(m => (
            <button
              key={m.code}
              onClick={() => setMode(m.code)}
              className={`px-3 py-1.5 rounded-full text-[12px] transition-all ${
                mode === m.code
                  ? 'bg-[#1A1A1A] text-white'
                  : 'bg-[#F5F5F5] text-[#999]'
              }`}
              style={{ fontFamily: 'inherit' }}
            >
              {m.label}
            </button>
          ))}
        </div>

        {mode !== 'skip' && (mode === 'mom' || mode === 'both') && (
          <DateInputGroup
            label="엄마"
            year={momYear} month={momMonth} day={momDay}
            setYear={setMomYear} setMonth={setMomMonth} setDay={setMomDay}
          />
        )}

        {mode !== 'skip' && (mode === 'dad' || mode === 'both') && (
          <DateInputGroup
            label="아빠"
            year={dadYear} month={dadMonth} day={dadDay}
            setYear={setDadYear} setMonth={setDadMonth} setDay={setDadDay}
          />
        )}

        {mode === 'skip' && (
          <p className="text-[12px] text-[#999] text-center py-4">이 섹션을 숨깁니다</p>
        )}

        <button
          onClick={handleSave}
          className="w-full h-11 mt-2 rounded-xl bg-[#1A1A1A] text-white text-sm font-medium active:scale-[0.98] transition-transform"
          style={{ fontFamily: 'inherit' }}
        >
          {mode === 'skip' ? '건너뛰기' : '저장'}
        </button>
      </div>
    </BottomSheet>
  )
}
