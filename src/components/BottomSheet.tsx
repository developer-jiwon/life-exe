'use client'

import { useState, useEffect, type ReactNode } from 'react'

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
        <div className="px-6 pt-5 pb-8">
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
}

export function BirthDateSheet({ open, onClose, currentDate, onSave }: BirthDateSheetProps) {
  const parts = currentDate.split('-')
  const [year, setYear] = useState(parts[0] || '1994')
  const [month, setMonth] = useState(parts[1] || '04')
  const [day, setDay] = useState(parts[2] || '30')

  useEffect(() => {
    const p = currentDate.split('-')
    if (p.length === 3) { setYear(p[0]); setMonth(p[1]); setDay(p[2]) }
  }, [currentDate])

  const [lang, setLang] = useState('ko')
  const LANGS = [
    { code: 'ko', label: '한국어' },
    { code: 'en', label: 'English' },
    { code: 'ja', label: '日本語' },
    { code: 'zh', label: '中文' },
    { code: 'hi', label: 'हिन्दी' },
  ]

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
              onClick={() => setLang(l.code)}
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
          Save
        </button>
      </div>
    </BottomSheet>
  )
}
