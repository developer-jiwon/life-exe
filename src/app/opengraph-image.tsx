import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Life.exe — 내 인생은 몇 퍼센트?'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OG() {
  // Default: 1994-04-30 기준
  const birth = new Date('1994-04-30')
  const today = new Date()
  const days = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24))
  const age = today.getFullYear() - birth.getFullYear()
  const pct = ((days / (83 * 365)) * 100).toFixed(1)
  const years = Math.floor(days / 365)
  const remainDays = days % 365
  const heartbeats = Math.round(days * 24 * 60 * 75 / 100_000_000)
  const seasons = age * 4

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: '#FFFFFF',
          padding: '60px 80px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#1A1A1A' }}>Life.exe</div>
        </div>

        {/* Hero */}
        <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '8px' }}>
          <span style={{ fontSize: '120px', fontWeight: 700, color: '#1A1A1A', lineHeight: 1 }}>{pct}</span>
          <span style={{ fontSize: '48px', fontWeight: 300, color: '#C0C0C0', marginLeft: '4px' }}>%</span>
        </div>
        <div style={{ fontSize: '14px', color: '#999999', letterSpacing: '3px', marginBottom: '40px' }}>OF YOUR LIFE</div>

        {/* Facts row */}
        <div style={{ display: 'flex', gap: '60px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '13px', color: '#999999' }}>이 세상에 온 지</span>
            <span style={{ fontSize: '36px', fontWeight: 700, color: '#1A1A1A' }}>{days.toLocaleString()}일</span>
            <span style={{ fontSize: '13px', color: '#999999' }}>{years}년 {remainDays}일째</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '13px', color: '#999999' }}>당신의 심장은</span>
            <span style={{ fontSize: '36px', fontWeight: 700, color: '#1A1A1A' }}>~{heartbeats}억 번</span>
            <span style={{ fontSize: '13px', color: '#999999' }}>쉬지 않고</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '13px', color: '#999999' }}>지나간 계절</span>
            <span style={{ fontSize: '36px', fontWeight: 700, color: '#1A1A1A' }}>{seasons}번</span>
            <span style={{ fontSize: '13px', color: '#999999' }}>봄여름가을겨울</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
