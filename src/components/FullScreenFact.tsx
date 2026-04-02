'use client'

import { useRef, useState, useEffect, type ReactNode } from 'react'

interface FullScreenFactProps {
  children: ReactNode
  align?: 'left' | 'center' | 'right'
}

export default function FullScreenFact({ children, align = 'left' }: FullScreenFactProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { setVisible(entry.isIntersecting) },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const alignClass = { left: 'text-left', center: 'text-center', right: 'text-right' }[align]

  return (
    <div
      ref={ref}
      className={`py-2.5 px-5 transition-all duration-700 ${alignClass}`}
      style={{
        opacity: visible ? 1 : 0.06,
        transform: visible ? 'translateY(0)' : 'translateY(8px)',
      }}
    >
      {children}
    </div>
  )
}
