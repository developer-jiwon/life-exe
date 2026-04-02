'use client'

import { useState } from 'react'

interface OnboardingProps {
  onComplete: (birthDate: string, gender?: 'male' | 'female' | 'other') => void
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [birthDate, setBirthDate] = useState('')
  const [gender, setGender] = useState<'male' | 'female' | 'other' | ''>('')

  const canSubmit = birthDate.length > 0

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-white">
      <div className="w-full max-w-sm space-y-12">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-[#1A1A1A]" style={{ fontFamily: 'var(--font-jakarta)' }}>
            Life.exe
          </h1>
          <p className="text-[#6B6B6B] text-sm">
            당신의 인생은 몇 퍼센트?
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs text-[#A0A0A0] uppercase tracking-wider">생년월일</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              min="1920-01-01"
              className="w-full h-14 px-4 rounded-xl bg-[#F5F5F5] border border-[#E5E5E5] text-[#1A1A1A] text-lg font-inherit focus:outline-none focus:border-[#1A1A1A] transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-[#A0A0A0] uppercase tracking-wider">성별 (선택)</label>
            <div className="flex gap-2">
              {([
                { value: 'male', label: '남성' },
                { value: 'female', label: '여성' },
                { value: 'other', label: '기타' },
              ] as const).map((option) => (
                <button
                  key={option.value}
                  onClick={() => setGender(gender === option.value ? '' : option.value)}
                  className={`flex-1 h-12 rounded-xl text-sm font-medium transition-all ${
                    gender === option.value
                      ? 'bg-[#1A1A1A] text-white'
                      : 'bg-[#F5F5F5] text-[#6B6B6B] border border-[#E5E5E5]'
                  }`}
                  style={{ fontFamily: 'inherit' }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => canSubmit && onComplete(birthDate, gender || undefined)}
          disabled={!canSubmit}
          className={`w-full h-14 rounded-xl text-base font-semibold transition-all ${
            canSubmit
              ? 'bg-[#1A1A1A] text-white active:scale-[0.98]'
              : 'bg-[#E5E5E5] text-[#A0A0A0] cursor-not-allowed'
          }`}
          style={{ fontFamily: 'inherit' }}
        >
          시작하기
        </button>
      </div>
    </div>
  )
}
