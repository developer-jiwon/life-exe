'use client'

import { useRef, useState, useEffect, type ReactNode } from 'react'

// 진짜 연한 파스텔 — opacity 0.08 수준
const PASTELS = [
  'rgba(255, 223, 140, 0.10)',  // 연노랑
  'rgba(255, 182, 193, 0.08)',  // 핑크
  'rgba(200, 180, 220, 0.08)',  // 라벤더
  'rgba(160, 210, 235, 0.08)',  // 소라
  'rgba(180, 225, 180, 0.08)',  // 연두
  'transparent',
  'transparent',
  'transparent',
]

interface FullScreenFactProps {
  children: ReactNode
  align?: 'left' | 'center' | 'right'
  colorIdx?: number
}

export default function FullScreenFact({ children, align = 'left', colorIdx }: FullScreenFactProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { setVisible(entry.isIntersecting) },
      { threshold: 0.5, rootMargin: '-10% 0px -10% 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const alignClass = { left: 'text-left', center: 'text-center', right: 'text-right' }[align]

  return (
    <div
      ref={ref}
      className={`py-2.5 px-5 transition-all duration-700 rounded-2xl ${alignClass}`}
      style={{
        opacity: visible ? 1 : 0.06,
        transform: visible ? 'translateY(0)' : 'translateY(8px)',
        backgroundColor: colorIdx !== undefined ? PASTELS[colorIdx % PASTELS.length] : 'transparent',
      }}
    >
      {children}
    </div>
  )
}
