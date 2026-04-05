import type { Metadata } from 'next'
import EOWApp from '@/components/eow/EOWApp'

export const metadata: Metadata = {
  title: 'End Of What — 마지막 한 문장',
  description: '남기고 싶은 한 문장을 cinematic 타이포그래피로.',
  openGraph: {
    title: 'End Of What — 마지막 한 문장',
    description: '남기고 싶은 한 문장을 cinematic 타이포그래피로.',
    type: 'website',
    images: [{ url: '/eow-og.png', width: 1200, height: 630, alt: 'End Of What' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'End Of What — 마지막 한 문장',
    description: '남기고 싶은 한 문장을 cinematic 타이포그래피로.',
    images: ['/eow-og.png'],
  },
}

export default function EOWPage() {
  return <EOWApp />
}
