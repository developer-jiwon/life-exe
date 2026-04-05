'use client'

import { useEffect, useState } from 'react'
import { getSavedSentences, deleteSentence } from '@/lib/eow-storage'

const DEFAULT_SENTENCES = [
  // ─── 일상 & 감성 ───
  '오늘 하늘 진짜 예뻤다',
  'Coffee first, everything else later',
  '나한테 잘했다고 말해주고 싶다',
  'Dancing alone in my room',
  '산책하다가 웃었다',
  'Still figuring it out',
  '좋아하는 노래 무한 반복 중',
  'Rainy days are my favorite',
  '이불 밖은 위험하다',
  'Soft mornings hit different',
  '오늘은 아무것도 안 하기로 했다',
  'Late night thoughts',
  '따뜻한 커피 한 잔의 위로',
  'The sky looked like a painting',
  '고양이가 내 무릎 위에서 잔다',
  'Bookmarks I will never read',
  '집 가고 싶다',
  'Sunlight through the window',
  '좋아하는 사람이랑 밥 먹는 게 행복이다',
  'That song gets me every time',
  '아이스크림은 항상 옳다',
  'Some days are just soft',
  '오늘도 무사히 끝났다',
  'My playlist knows me better than I do',
  '요즘 하늘이 자주 예쁘다',
  // ─── 자기 다짐 & 성장 ───
  '느려도 괜찮아 가고 있으니까',
  'Getting better at being me',
  '어제보다 조금 더 단단해졌다',
  'Small steps still count',
  '완벽하지 않아도 충분하다',
  'Learning to rest without guilt',
  '내 속도로 가는 중',
  'Progress looks different for everyone',
  '지금 이 순간에 집중',
  'One day at a time',
  '나를 믿어보기로 했다',
  'Building something quietly',
  '실패해도 괜찮아 다시 하면 돼',
  'Choosing myself today',
  '작은 변화가 모이는 중',
  'Not there yet but closer',
  '오늘의 내가 내일의 나를 만든다',
  'Patience is a slow kind of courage',
  '포기 안 했으면 아직 진행 중이다',
  'Trusting the timing of my life',
  // ─── 위트 & 유머 ───
  '월요일은 왜 매주 오는 거야',
  'My brain has too many tabs open',
  '다이어트는 내일부터',
  'Adulting is a scam',
  '퇴근이 제일 좋아',
  'I speak fluent sarcasm',
  '쿠팡 장바구니가 월급보다 비싸다',
  'My bed is my best friend',
  '치킨은 사랑이다',
  'Running on caffeine and hope',
  '주말이 짧은 건 버그다',
  'Overthinking should be a sport',
  '배달 앱 열었다 닫았다 세 번째',
  'Nap enthusiast',
  '라면은 새벽에 끓여야 맛있다',
  'Professional procrastinator',
  '고양이가 세상을 지배할 거다',
  'Sleep is the new luxury',
  '냉장고 열었다가 그냥 닫음',
  'Plot twist: I am the main character',
  // ─── 관계 & 사람 ───
  '고마운 사람이 있다는 게 행복이다',
  'Some people feel like home',
  '같이 걷는 것만으로 좋은 사람',
  'Friends who get your silence',
  '말 안 해도 아는 사이가 있다',
  'Distance means nothing with the right people',
  '네가 웃으면 나도 웃게 된다',
  'Old friends are gold',
  '전화보다 옆에 있는 게 좋다',
  'The people you keep choosing',
  '같이 밥 먹자는 말이 사랑이다',
  'Laughter is louder with you',
  '보고 싶은 사람에게 먼저 연락했다',
  'Shared silence is underrated',
  '좋은 사람 옆에 있으면 나도 좋은 사람이 된다',
  // ─── 계절 & 순간 ───
  '봄바람이 기분 좋다',
  'Summer nights and city lights',
  '가을에는 괜히 센치해진다',
  'Winter mornings are magic',
  '벚꽃 피면 괜히 설렌다',
  'Golden hour is therapy',
  '비 오는 날 창문 열기',
  'Stars are always there even in daylight',
  '첫눈 오면 좋겠다',
  'Wind in my hair kind of day',
  '노을 보면서 멍 때리기',
  'Clouds that look like something',
  '새벽 공기가 제일 깨끗하다',
  'The moon followed me home',
  '우산 없이 비 맞아본 적 있어',
  // ─── 꿈 & 미래 ───
  '언젠간 바다 앞에 살고 싶다',
  'Making plans I actually want to keep',
  '내 카페를 열고 싶다',
  'Dreaming with my eyes open',
  '서른 살의 나에게 보내는 편지',
  'Tomorrow has so much room',
  '여행 가고 싶다 지금 당장',
  'Saving up for freedom',
  '좋아하는 일로 먹고 살고 싶다',
  'What if it all works out',
  '버킷리스트 하나 지웠다',
  'The best chapter is unwritten',
  '새로운 시작이 두렵지 않다',
  'Ideas at 3am hit different',
  '내년의 나는 분명 더 멋질 거다',
  // ─── 감정 솔직 ───
  '오늘은 좀 울어도 되는 날',
  'It is okay to not be okay sometimes',
  '감정에도 쉬는 시간이 필요하다',
  'Healing is not linear',
  '괜찮다는 말 대신 안아줬으면',
  'Giving myself permission to feel',
  '힘들면 힘들다고 말해도 돼',
  'Some wounds need air not band-aids',
  '오늘 좀 지쳤지만 내일은 다를 거야',
  'Feelings are just visitors',
  '혼자 있고 싶은 날도 있다',
  'Brave enough to be soft',
  '울고 나면 좀 나아진다',
  'Messy feelings are still valid',
  '나한테 좀 더 다정해지기로 했다',
  // ─── 짧은 한 마디 ───
  '좋은 하루',
  'Just breathe',
  '그래도 간다',
  'Almost there',
  '천천히',
  'Keep going',
  '한 걸음씩',
  'Not bad',
  '뭐든 될 거야',
  'Why not',
  '할 수 있다',
  'Here we go',
  '오늘도 화이팅',
  'Step by step',
  '나쁘지 않아',
]

interface SentenceWallProps {
  onSentenceClick?: (text: string) => void
  refreshKey?: number
}

export default function SentenceWall({ onSentenceClick, refreshKey }: SentenceWallProps) {
  const [sentences, setSentences] = useState<string[]>(DEFAULT_SENTENCES)
  const [userSentences, setUserSentences] = useState<Set<string>>(new Set())

  useEffect(() => {
    const saved = getSavedSentences()
    const savedTexts = saved.map(s => s.text)
    setUserSentences(new Set(savedTexts))
    const merged = [
      ...savedTexts,
      ...DEFAULT_SENTENCES.filter(d => !savedTexts.includes(d)),
    ]
    setSentences(merged)
  }, [refreshKey])

  function handleDelete(text: string) {
    deleteSentence(text)
    setUserSentences(prev => { const n = new Set(prev); n.delete(text); return n })
    setSentences(prev => prev.filter(s => s !== text))
  }

  return (
    <div className="w-full px-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {sentences.map((sentence, i) => {
          const isMine = userSentences.has(sentence)
          return (
            <TicketCard
              key={`${sentence}-${i}`}
              text={sentence}
              isMine={isMine}
              onClick={() => onSentenceClick?.(sentence)}
              onDelete={isMine ? () => handleDelete(sentence) : undefined}
            />
          )
        })}
      </div>
    </div>
  )
}

function TicketCard({ text, isMine, onClick, onDelete }: { text: string; isMine: boolean; onClick?: () => void; onDelete?: () => void }) {
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className="relative w-full text-left active:scale-[0.97] transition-transform duration-150"
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

      {/* Delete button for user sentences */}
      {onDelete && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete() }}
          className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#333] text-[#888] text-[10px] flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:bg-[#555] hover:text-[#FFF] transition-all z-10"
        >
          ✕
        </button>
      )}
    </div>
  )
}
