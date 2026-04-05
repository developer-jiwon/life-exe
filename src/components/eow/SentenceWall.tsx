'use client'

import { useEffect, useState } from 'react'
import { getSavedSentences } from '@/lib/eow-storage'

const DEFAULT_SENTENCES = [
  '결국 사랑이었다',
  'I tried my best',
  '내일은 오늘보다 나을 거야',
  'Delete my browser history',
  '엄마 미안해',
  'It was worth it',
  '배고프다',
  '다음 생에는 고양이로',
  'No regrets, only lessons',
  '그때 말할걸',
  '잘 살았다',
  'See you on the other side',
  '치킨 먹고 싶다',
  '사랑해 말하지 못한 사람에게',
  'Finally, peace',
  '아직 안 끝났다',
  '고마웠어 전부',
  'One more time',
  '별이 되고 싶다',
  'Worth every second',
  '그래도 괜찮았다',
  'Tell them I loved it',
  '늦지 않았으면 좋겠다',
  'Not bad for a human',
  // ─── 추가 ───
  '한 번만 더 안아줘',
  'This was fun',
  '후회는 없다 진짜로',
  'Remember me kindly',
  '오늘도 수고했어',
  'I was here',
  '괜찮아 다 지나가',
  'The sunset was beautiful',
  '고양이가 최고야',
  'Keep going',
  '내가 틀렸을 수도 있다',
  'It gets better',
  '그래서 어쩌라고',
  'Thank you for everything',
  '어디서부터 잘못된 걸까',
  'Be kind to yourself',
  '다 부질없다',
  'Start over',
  '웃기지도 않네',
  'Love wins',
  '그냥 쉬고 싶다',
  'Nothing lasts forever',
  '버텼다는 것만으로도 충분해',
  'Plot twist',
  '아 진짜 힘들다',
  'Almost there',
  '다시 태어나도 나로 살래',
  'Let it go',
  '오늘은 여기까지',
  'To be continued',
  '이것도 지나간다',
  'What a ride',
  '좋은 사람이고 싶었다',
  'Game over',
  '아직 할 말이 많은데',
  'Goodbye cruel world lol',
  '그래도 재밌었다',
  'Take care of my plants',
  '내 몫까지 잘 먹어',
  'In another life',
  '여기까지가 내 한계였다',
  'Do not go gentle',
  '마지막 순간에도 웃고 싶다',
  'Stay weird',
  '그 노래 한 번만 더 들을게',
  'It was always you',
  '수고했어 오늘도',
  'Live laugh love 아 닥쳐',
  '별일 아니었으면 좋겠다',
  'Ctrl+Z',
]

interface SentenceWallProps {
  onSentenceClick?: (text: string) => void
  refreshKey?: number
}

export default function SentenceWall({ onSentenceClick, refreshKey }: SentenceWallProps) {
  const [sentences, setSentences] = useState<string[]>(DEFAULT_SENTENCES)

  useEffect(() => {
    const saved = getSavedSentences()
    const savedTexts = saved.map(s => s.text)
    const merged = [
      ...savedTexts,
      ...DEFAULT_SENTENCES.filter(d => !savedTexts.includes(d)),
    ]
    setSentences(merged)
  }, [refreshKey])

  return (
    <div className="w-full max-w-[480px] mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {sentences.map((sentence, i) => (
          <TicketCard
            key={`${sentence}-${i}`}
            text={sentence}
            isMine={!DEFAULT_SENTENCES.includes(sentence)}
            onClick={() => onSentenceClick?.(sentence)}
          />
        ))}
      </div>
    </div>
  )
}

function TicketCard({ text, isMine, onClick }: { text: string; isMine: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="relative w-full text-left group active:scale-[0.97] transition-transform duration-150"
    >
      <div className={`
        ${isMine ? 'bg-[#1E1E1C] border-[#3A3A38]' : 'bg-[#1E1E1C] border-[#2A2A28]'}
        border px-4 py-4 group-hover:bg-[#262624] transition-colors duration-200
      `}>
        <div className="absolute top-0 left-2 right-2 flex justify-between">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="w-[3px] h-[3px] rounded-full bg-[#111] -mt-[1.5px]" />
          ))}
        </div>

        <p
          className={`
            text-[#D0D0C8] text-[12px] leading-relaxed font-light break-keep
            group-hover:text-[#F5F5F0] transition-colors duration-200
            ${text.length > 15 ? 'text-[11px]' : ''}
          `}
          style={{ fontFamily: 'var(--font-noto-serif), var(--font-cormorant), serif' }}
        >
          {text}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-[8px] text-[#555] tracking-widest uppercase" style={{ fontFamily: 'var(--font-jakarta)' }}>
            {isMine ? 'YOU' : 'EOW'}
          </span>
          <span className="text-[8px] text-[#F5F5F0]/0 group-hover:text-[#F5F5F0]/40 transition-all duration-200 tracking-wider" style={{ fontFamily: 'var(--font-jakarta)' }}>
            play ▶
          </span>
        </div>

        <div className="absolute bottom-0 left-2 right-2 flex justify-between">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="w-[3px] h-[3px] rounded-full bg-[#111] -mb-[1.5px]" />
          ))}
        </div>
      </div>
    </button>
  )
}
