'use client'

import { useEffect } from 'react'

export default function ScrollBackground({ birthDate }: { birthDate: string }) {
  useEffect(() => {
    // 생년월일로 색상 hue 결정 (사람마다 다른 톤)
    const hash = birthDate.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
    const baseHue = hash % 360 // 0~360

    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = Math.min(scrollTop / Math.max(docHeight, 1), 1)

      // ease-in-out: 아주 자연스럽게
      const eased = progress * progress * (3 - 2 * progress)

      // hue가 스크롤하면서 살짝 이동 (30도만)
      const hue = baseHue + eased * 30

      // saturation: 0% → 8% (아주 살짝)
      const sat = eased * 8

      // lightness: 100% → 96% (거의 흰색 유지)
      const light = 100 - eased * 4

      document.body.style.backgroundColor = `hsl(${hue}, ${sat}%, ${light}%)`
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
