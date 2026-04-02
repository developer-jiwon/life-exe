'use client'

import { useEffect } from 'react'

// 연한 파스텔 — 스크롤 진행률에 따라 전환
const COLORS = [
  [255, 255, 255],     // 흰색 (시작)
  [255, 248, 230],     // 연노랑
  [255, 240, 242],     // 핑크
  [242, 237, 250],     // 라벤더
  [235, 245, 252],     // 소라
  [240, 250, 240],     // 연두
  [255, 248, 230],     // 연노랑
  [255, 255, 255],     // 흰색 (끝)
]

function lerp(a: number[], b: number[], t: number): number[] {
  return a.map((v, i) => Math.round(v + (b[i] - v) * t))
}

export default function ScrollBackground() {
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = Math.min(scrollTop / Math.max(docHeight, 1), 1)

      const segments = COLORS.length - 1
      const segment = progress * segments
      const idx = Math.min(Math.floor(segment), segments - 1)
      const t = segment - idx

      const color = lerp(COLORS[idx], COLORS[idx + 1], t)
      document.body.style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return null
}
