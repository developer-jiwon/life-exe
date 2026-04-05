'use client'

import { useEffect, useState } from 'react'
import { getSavedSentences, deleteSentence } from '@/lib/eow-storage'

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
  // ─── batch 2 ───
  '커피 한 잔만 더',
  'Brb going to space',
  '왜 눈물이 나지',
  'Mission accomplished',
  '나 좀 칭찬해줘',
  'Everything happens for a reason',
  '뭐든 될 거야',
  'Sorry not sorry',
  '오늘 하루도 버텼다',
  'Catch me if you can',
  '나는 나를 사랑한다',
  'This too shall pass',
  '내 탓이 아니야',
  'Trust the process',
  '그만 생각하자',
  'Hakuna matata',
  '아무도 모르게 울었다',
  'Born to be wild',
  '진심이었어 전부',
  'Fake it till you make it',
  '내일의 나에게 미루자',
  'Hold on',
  '시간아 천천히 가',
  'No pain no gain',
  '아 배고파 진짜',
  'Just breathe',
  '할 수 있다 할 수 있다',
  'Less is more',
  '혼자서도 괜찮아',
  'Carpe diem',
  // ─── batch 3 ───
  '좋은 하루였다',
  'Yolo but also save money',
  '다 끝나면 치맥',
  'Memento mori',
  '우리 다시 만나자',
  'Be water my friend',
  '하고 싶은 거 하고 살자',
  'Send memes not nudes',
  '나 혼자만의 시간',
  'To infinity and beyond',
  '오늘 뭐 먹지',
  'Per aspera ad astra',
  '너무 무리하지 마',
  'Error 404: life not found',
  '이 순간을 기억해',
  'Work hard play hard',
  '내가 나를 모르겠다',
  'Wifi password is love',
  '아직 꿈이 있다',
  'Life is short eat dessert first',
  '마음이 복잡하다',
  'New phone who dis',
  '웃으면 복이 와',
  'Siri play my funeral playlist',
  '한 걸음씩',
  'Thanks Obama',
  '운명이었나 봐',
  'Winter is coming',
  '그냥 되는 대로 살자',
  'May the force be with you',
  // ─── batch 4 ───
  '나도 누군가의 별이고 싶다',
  'Subscribe to my existence',
  '잘 자 내일 봐',
  'Insert coin to continue',
  '밥은 먹고 다니냐',
  'Achievement unlocked: survived',
  '누가 좀 안아줘',
  'Loading... 99%',
  '내 인생 BGM은 뭘까',
  'Updating... do not turn off',
  '작은 것에 감사하자',
  'Task failed successfully',
  '지금이 가장 어린 나',
  'Connection lost',
  '좋은 어른이 되고 싶다',
  'Are we there yet',
  '비가 오면 우산을 써',
  'Please stand by',
  '하루가 이렇게 또 간다',
  'Buffering...',
  '사소한 게 행복이었다',
  'GG WP',
  '떠나고 나서야 알았다',
  'Season finale',
  '그때로 돌아가고 싶다',
  'End credits',
  '충분했어 정말',
  'Directed by life',
  '아직 에필로그가 남았다',
  'Post credits scene loading',
  // ─── batch 5 ───
  '내일도 해가 뜬다',
  'Unsubscribe from adulting',
  '넘어져도 다시 일어나',
  'Alt F4',
  '감사합니다 여기까지',
  'Shutting down...',
  '남은 건 추억뿐',
  'Do not disturb',
  '그래도 살아야지',
  'Out of office forever',
  '좋았던 날들이 더 많았다',
  'System error: too many feelings',
  '마지막 노을이 예뻤다',
  'Respawning in 3... 2... 1...',
  '이 정도면 잘 살았다',
  '404 regrets not found',
  '못 다 한 말이 있어',
  'Brb reincarnating',
  '그래도 웃었다',
  'Deleting cache...',
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
      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
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
          className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#333] text-[#888] text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-[#555] hover:text-[#FFF] transition-all z-10"
        >
          ✕
        </button>
      )}
    </div>
  )
}
