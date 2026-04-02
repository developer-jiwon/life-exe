'use client'

import { useEffect } from 'react'

// 파스텔 색 — 좀 더 확실하게
const PASTELS = [
  [255, 240, 210],     // 연노랑
  [250, 228, 232],     // 핑크
  [235, 228, 248],     // 라벤더
  [225, 240, 252],     // 소라
  [230, 248, 230],     // 연두
]

export default function ScrollBackground({ birthDate }: { birthDate: string }) {
  useEffect(() => {
    const hash = birthDate.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
    const color = PASTELS[hash % PASTELS.length]

    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = Math.min(scrollTop / Math.max(docHeight, 1), 1)

      // 0% → 흰색, 100% → 파스텔 (최대 70% 강도)
      const intensity = progress * 0.7

      const r = Math.round(255 + (color[0] - 255) * intensity)
      const g = Math.round(255 + (color[1] - 255) * intensity)
      const b = Math.round(255 + (color[2] - 255) * intensity)

      document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.body.style.backgroundColor = '#FFFFFF'
    }
  }, [birthDate])

  return null
}
