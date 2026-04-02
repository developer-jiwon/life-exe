import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Life.exe — How far along are you?'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OG() {
  const birth = new Date('1994-04-30')
  const today = new Date()
  const days = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24))
  const years = Math.floor(days / 365)
  const remainDays = days % 365
  const pct = ((days / (83 * 365)) * 100).toFixed(1)
  const heartbeats = Math.round(days * 24 * 60 * 75 / 100_000_000)
  const age = today.getFullYear() - birth.getFullYear()

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FFFFFF',
          padding: '60px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <span style={{ fontSize: '160px', fontWeight: 800, color: '#1A1A1A', lineHeight: 1 }}>{pct}</span>
          <span style={{ fontSize: '60px', fontWeight: 300, color: '#C0C0C0', marginLeft: '6px' }}>%</span>
        </div>

        <div style={{ fontSize: '16px', color: '#999999', letterSpacing: '4px', marginTop: '8px', textTransform: 'uppercase' as const }}>
          of your life
        </div>

        <div style={{ display: 'flex', gap: '80px', marginTop: '50px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: '#999999' }}>Days alive</span>
            <span style={{ fontSize: '40px', fontWeight: 700, color: '#1A1A1A' }}>{days.toLocaleString()}</span>
            <span style={{ fontSize: '13px', color: '#999999' }}>{years}y {remainDays}d</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: '#999999' }}>Heartbeats</span>
            <span style={{ fontSize: '40px', fontWeight: 700, color: '#1A1A1A' }}>~{heartbeats}B</span>
            <span style={{ fontSize: '13px', color: '#999999' }}>never stopped</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: '#999999' }}>Seasons</span>
            <span style={{ fontSize: '40px', fontWeight: 700, color: '#1A1A1A' }}>{age * 4}</span>
            <span style={{ fontSize: '13px', color: '#999999' }}>springs, summers, falls, winters</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
