'use client'

import type { Mood } from '@/lib/types'
import { MOOD_CONFIG } from '@/lib/types'

interface MoodSelectorProps {
  selected: Mood | null
  onSelect: (mood: Mood) => void
}

const MOODS: Mood[] = ['joy', 'calm', 'energy', 'tired', 'sad', 'angry', 'lazy']

export default function MoodSelector({ selected, onSelect }: MoodSelectorProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-[#6B6B6B]">
        {selected ? '오늘의 감정' : '오늘의 감정은?'}
      </p>
      <div className="flex justify-between items-center px-2">
        {MOODS.map((mood) => {
          const config = MOOD_CONFIG[mood]
          const isSelected = selected === mood
          return (
            <button
              key={mood}
              onClick={() => onSelect(mood)}
              className="flex flex-col items-center gap-1.5 group"
              aria-label={config.label}
            >
              <div
                className="rounded-full transition-all duration-200 ease-out"
                style={{
                  width: isSelected ? 44 : 38,
                  height: isSelected ? 44 : 38,
                  backgroundColor: config.color,
                  opacity: selected && !isSelected ? 0.4 : 1,
                  boxShadow: isSelected ? `0 0 0 2px #FAFAFA, 0 0 0 4px ${config.color}` : 'none',
                }}
              />
              <span
                className="text-[10px] transition-opacity"
                style={{
                  color: isSelected ? '#1A1A1A' : '#A0A0A0',
                  fontWeight: isSelected ? 600 : 400,
                }}
              >
                {config.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
