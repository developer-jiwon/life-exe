'use client'

import { useEffect } from 'react'

// 생년월일에 따라 파스텔 하나 결정
const PASTELS = [
  [255, 248, 235],     // 연노랑
  [252, 242, 244],     // 핑크
  [245, 242, 252],     // 라벤더
  [240, 247, 252],     // 소라
  [243, 250, 243],     // 연두
]

export default function ScrollBackground({ birthDate }: { birthDate: string }) {
  useEffect(() => {
    // 생년월일 해시로 색 하나 고정
    const hash = birthDate.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
    const color = PASTELS[hash % PASTELS.length]

    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = Math.min(scrollTop / Math.max(docHeight, 1), 1)

      // 0% → 흰색, 100% → 파스텔 (최대 40% 강도 = 아주 연하게)
      const intensity = progress * 0.4

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
