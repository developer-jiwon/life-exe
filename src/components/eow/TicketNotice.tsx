'use client'

import { useState, useEffect } from 'react'

interface TicketNoticeProps {
  onAccept: () => void
}

export default function TicketNotice({ onAccept }: TicketNoticeProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Skip notice if user has seen it before
    if (localStorage.getItem('eow-noticed')) {
      onAccept()
      return
    }
    setTimeout(() => setVisible(true), 100)
  }, [onAccept])

  function handleAccept() {
    localStorage.setItem('eow-noticed', '1')
    onAccept()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 bg-black/60 backdrop-blur-sm">
      <div
        className={`
          relative max-w-[340px] w-full bg-[#F5F5F0] text-[#0A0A0A]
          transition-all duration-500
          ${visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}
        `}
      >
        {/* Top torn edge */}
        <div className="absolute -top-[6px] left-0 right-0 h-[6px] overflow-hidden">
          <svg width="100%" height="6" preserveAspectRatio="none" viewBox="0 0 340 6">
            <path
              d="M0,6 L0,3 Q8.5,0 17,3 Q25.5,6 34,3 Q42.5,0 51,3 Q59.5,6 68,3 Q76.5,0 85,3 Q93.5,6 102,3 Q110.5,0 119,3 Q127.5,6 136,3 Q144.5,0 153,3 Q161.5,6 170,3 Q178.5,0 187,3 Q195.5,6 204,3 Q212.5,0 221,3 Q229.5,6 238,3 Q246.5,0 255,3 Q263.5,6 272,3 Q280.5,0 289,3 Q297.5,6 306,3 Q314.5,0 323,3 Q331.5,6 340,3 L340,6 Z"
              fill="#F5F5F0"
            />
          </svg>
        </div>

        {/* Content */}
        <div className="px-7 pt-8 pb-4">
          <p
            className="text-[10px] tracking-[0.25em] uppercase text-[#999] mb-5"
            style={{ fontFamily: 'var(--font-jakarta)' }}
          >
            End Of What
          </p>

          <p className="text-[15px] font-semibold leading-relaxed mb-3">
            마지막으로 남길 한 문장을 써보세요.
          </p>
          <p className="text-[12px] text-[#777] leading-relaxed mb-2">
            문장은 이 기기에만 저장됩니다.<br />
            서버로 전송되지 않아요.
          </p>
          <p className="text-[11px] text-[#999] leading-relaxed mb-6">
            링크로 공유하면 친구도 볼 수 있어요.
          </p>
        </div>

        {/* Perforated line */}
        <div className="mx-4 border-t border-dashed border-[#D0D0C8]" />

        {/* Accept button area */}
        <div className="px-7 py-5">
          <button
            onClick={handleAccept}
            className="
              w-full py-3 text-[12px] tracking-widest uppercase font-semibold
              bg-[#0A0A0A] text-[#F5F5F0] rounded-md
              hover:bg-[#1A1A1A] active:scale-[0.98] transition-all duration-200
            "
            style={{ fontFamily: 'var(--font-jakarta)' }}
          >
            Start
          </button>
        </div>

        {/* Bottom torn edge */}
        <div className="absolute -bottom-[6px] left-0 right-0 h-[6px] overflow-hidden">
          <svg width="100%" height="6" preserveAspectRatio="none" viewBox="0 0 340 6">
            <path
              d="M0,0 L0,3 Q8.5,6 17,3 Q25.5,0 34,3 Q42.5,6 51,3 Q59.5,0 68,3 Q76.5,6 85,3 Q93.5,0 102,3 Q110.5,6 119,3 Q127.5,0 136,3 Q144.5,6 153,3 Q161.5,0 170,3 Q178.5,6 187,3 Q195.5,0 204,3 Q212.5,6 221,3 Q229.5,0 238,3 Q246.5,6 255,3 Q263.5,0 272,3 Q280.5,6 289,3 Q297.5,0 306,3 Q314.5,6 323,3 Q331.5,0 340,3 L340,0 Z"
              fill="#F5F5F0"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}
