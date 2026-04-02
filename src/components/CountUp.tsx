'use client'

import { useState, useEffect, useRef } from 'react'

interface CountUpProps {
  end: number
  duration?: number
  prefix?: string
  suffix?: string
  decimals?: number
  className?: string
}

export default function CountUp({ end, duration = 1500, prefix = '', suffix = '', decimals = 0, className = '' }: CountUpProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const prevEnd = useRef(end)
  const animated = useRef(false)

  // end 값이 바뀌면 리셋
  useEffect(() => {
    if (prevEnd.current !== end) {
      prevEnd.current = end
      animated.current = false
      setCount(0)
    }
  }, [end])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true
          const startTime = performance.now()

          const animate = (now: number) => {
            const elapsed = now - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(eased * end)
            if (progress < 1) requestAnimationFrame(animate)
          }

          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.5, rootMargin: '-5% 0px -5% 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [end, duration])

  const formatted = decimals > 0
    ? count.toFixed(decimals)
    : Math.floor(count).toLocaleString()

  return (
    <span ref={ref} className={className}>
      {prefix}{formatted}{suffix}
    </span>
  )
}
