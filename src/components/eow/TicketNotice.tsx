'use client'

import { useState, useEffect } from 'react'

interface TicketNoticeProps {
  onAccept: () => void
}

export default function TicketNotice({ onAccept }: TicketNoticeProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setVisible(true), 100)
  }, [])

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 bg-black/60 backdrop-blur-sm">
      <div
        className={`
          relative max-w-[340px] w-full bg-[#F5F5F0] text-[#0A0A0A]
          transition-all duration-500
          ${visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}
        `}
      >
        <div className="absolute -top-[6px] left-0 right-0 h-[6px] overflow-hidden">
          <svg width="100%" height="6" preserveAspectRatio="none" viewBox="0 0 340 6"><path d="M0,6 L0,3 Q8.5,0 17,3 Q25.5,6 34,3 Q42.5,0 51,3 Q59.5,6 68,3 Q76.5,0 85,3 Q93.5,6 102,3 Q110.5,0 119,3 Q127.5,6 136,3 Q144.5,0 153,3 Q161.5,6 170,3 Q178.5,0 187,3 Q195.5,6 204,3 Q212.5,0 221,3 Q229.5,6 238,3 Q246.5,0 255,3 Q263.5,6 272,3 Q280.5,0 289,3 Q297.5,6 306,3 Q314.5,0 323,3 Q331.5,6 340,3 L340,6 Z" fill="#F5F5F0" /></svg>
        </div>
        <div className="px-7 pt-8 pb-4">
          <p className="text-[10px] tracking-[0.25em] uppercase text-[#999] mb-5" style={{ fontFamily: 'var(--font-jakarta)' }}>End Of What</p>
          <p className="text-[15px] font-semibold leading-relaxed mb-3">마지막 한 문장,<br />여기에 남겨두세요.</p>
          <p className="text-[12px] text-[#777] leading-relaxed mb-2">당신의 문장은 오직 이 기기 안에만 머물러요.<br />어디로도 보내지 않아요.</p>
          <p className="text-[11px] text-[#999] leading-relaxed mb-2">원한다면, 링크 하나로 누군가에게 건네줄 수 있어요.</p>
          <p className="text-[11px] text-[#999] leading-relaxed mb-5">인스타그램 릴스로도 공유할 수 있어요.</p>
          <a
            href="https://www.threads.com/@jiwonnnnieee"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0A0A0A] text-[#F5F5F0] text-[10px] tracking-wider hover:bg-[#2A2A2A] transition-colors"
            style={{ fontFamily: 'var(--font-jakarta)' }}
          >
            @jiwonnnnieee
            <span className="text-[#666]">의 세상</span>
          </a>
        </div>
        <div className="mx-4 border-t border-dashed border-[#D0D0C8]" />
        <div className="px-7 py-5">
          <button onClick={onAccept} className="w-full py-3 text-[12px] tracking-widest uppercase font-semibold bg-[#0A0A0A] text-[#F5F5F0] rounded-md hover:bg-[#1A1A1A] active:scale-[0.98] transition-all duration-200" style={{ fontFamily: 'var(--font-jakarta)' }}>Start</button>
        </div>
        <div className="absolute -bottom-[6px] left-0 right-0 h-[6px] overflow-hidden">
          <svg width="100%" height="6" preserveAspectRatio="none" viewBox="0 0 340 6"><path d="M0,0 L0,3 Q8.5,6 17,3 Q25.5,0 34,3 Q42.5,6 51,3 Q59.5,0 68,3 Q76.5,6 85,3 Q93.5,0 102,3 Q110.5,6 119,3 Q127.5,0 136,3 Q144.5,6 153,3 Q161.5,0 170,3 Q178.5,6 187,3 Q195.5,0 204,3 Q212.5,6 221,3 Q229.5,0 238,3 Q246.5,6 255,3 Q263.5,0 272,3 Q280.5,6 289,3 Q297.5,0 306,3 Q314.5,6 323,3 Q331.5,0 340,3 L340,0 Z" fill="#F5F5F0" /></svg>
        </div>
      </div>
    </div>
  )
}
