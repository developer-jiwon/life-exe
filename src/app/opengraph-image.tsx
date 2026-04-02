import { ImageResponse } from 'next/og'
import { readFile } from 'fs/promises'
import { join } from 'path'

export const alt = 'Life.exe — How far along are you?'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OG() {
  const [fontBold, fontRegular] = await Promise.all([
    readFile(join(process.cwd(), 'src/fonts/jakarta-700.woff')),
    readFile(join(process.cwd(), 'src/fonts/jakarta-400.woff')),
  ])

  const birth = new Date('1994-04-30')
  const today = new Date()
  const days = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24))
  const pct = ((days / (83 * 365)) * 100).toFixed(1)

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
          fontFamily: 'Jakarta',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <span style={{ fontSize: '200px', fontWeight: 700, color: '#1A1A1A', lineHeight: 1 }}>{pct}</span>
          <span style={{ fontSize: '80px', fontWeight: 400, color: '#C0C0C0', marginLeft: '8px' }}>%</span>
        </div>
        <div style={{ fontSize: '18px', color: '#999999', letterSpacing: '5px', marginTop: '12px', fontWeight: 400 }}>
          OF YOUR LIFE
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Jakarta', data: fontBold, weight: 700, style: 'normal' as const },
        { name: 'Jakarta', data: fontRegular, weight: 400, style: 'normal' as const },
      ],
    }
  )
}
