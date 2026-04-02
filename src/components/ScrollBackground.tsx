'use client'

import { useEffect } from 'react'

// 스크롤 진행에 따라 색이 서서히 변하면서 진해짐
// 흰색 → 연노랑 → 연핑크 → 연라벤더 (아주 자연스럽게)
const STOPS = [
  [255, 255, 255],     // 0% - 흰색
  [255, 252, 245],     // 25% - 아주 살짝 따뜻한 흰
  [255, 247, 240],     // 50% - 연한 피치
  [248, 244, 252],     // 75% - 연한 라벤더
  [244, 248, 252],     // 100% - 연한 소라
]

function lerpColor(a: number[], b: number[], t: number): number[] {
  return a.map((v, i) => Math.round(v + (b[i] - v) * t))
}

export default function ScrollBackground({ birthDate }: { birthDate: string }) {
  useEffect(() => {
    // 생년월일로 색 순서 살짝 회전 (사람마다 다른 색 경험)
    const hash = birthDate.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
    const offset = hash % 3 // 0, 1, or 2 — 시작 색 오프셋

    const shifted = [...STOPS]
    // 중간 3개 색만 회전 (시작/끝 흰색은 유지)
    const mid = [shifted[1], shifted[2], shifted[3]]
    const rotated = [...mid.slice(offset), ...mid.slice(0, offset)]
    shifted[1] = rotated[0]
    shifted[2] = rotated[1]
    shifted[3] = rotated[2]

    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = Math.min(scrollTop / Math.max(docHeight, 1), 1)

      // ease-in: 처음엔 거의 변화 없다가 뒤로 갈수록 서서히
      const eased = progress * progress

      const segments = shifted.length - 1
      const segment = eased * segments
      const idx = Math.min(Math.floor(segment), segments - 1)
      const t = segment - idx

      const color = lerpColor(shifted[idx], shifted[idx + 1], t)
      document.body.style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`
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
