'use client'

import { useEffect, useRef, useCallback } from 'react'
import { playCinemaReveal, playTypewriterClack, playFlickerTick, playWhisperBreath } from '@/lib/eow-sound'

const SPEED = 1.0

type AnimationStyle = 'cinema' | 'typewriter' | 'flicker' | 'whisper'

interface TypoAnimatorProps {
  text: string
  style: AnimationStyle
  onComplete?: (reelsBlob: Blob | null) => void
  isPlaying: boolean
}

// ─── UTILS ───
const easeOutExpo = (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

function hasKorean(text: string): boolean { return /[가-힣ㄱ-ㅎㅏ-ㅣ]/.test(text) }

function getSerifFont(weight: number, size: number, text: string) {
  return hasKorean(text)
    ? `${weight} ${size}px "Noto Serif KR", "Cormorant Garamond", Georgia, serif`
    : `${weight} ${size}px "Cormorant Garamond", "Noto Serif KR", Georgia, serif`
}

function getSansFont(weight: number, size: number) {
  return `${weight} ${size}px "Plus Jakarta Sans", "Pretendard", sans-serif`
}

interface Dust { x: number; y: number; s: number; o: number; sp: number; d: number }

function createDust(w: number, h: number, n: number): Dust[] {
  return Array.from({ length: n }, () => ({
    x: Math.random() * w, y: Math.random() * h,
    s: 0.3 + Math.random() * 1.2, o: 0.05 + Math.random() * 0.15,
    sp: 0.05 + Math.random() * 0.2, d: (Math.random() - 0.5) * 0.15,
  }))
}

function tickDust(dust: Dust[], w: number, h: number) {
  for (const p of dust) {
    p.y -= p.sp; p.x += p.d + Math.sin(p.y * 0.008) * 0.15
    if (p.y < -5) { p.y = h + 5; p.x = Math.random() * w }
  }
}

function drawDust(ctx: CanvasRenderingContext2D, dust: Dust[]) {
  for (const p of dust) {
    ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(245,245,240,${p.o})`; ctx.fill()
  }
}

function drawVignette(ctx: CanvasRenderingContext2D, w: number, h: number, strength = 0.55) {
  const g = ctx.createRadialGradient(w / 2, h / 2, w * 0.25, w / 2, h / 2, w * 0.85)
  g.addColorStop(0, 'rgba(10,10,10,0)'); g.addColorStop(1, `rgba(10,10,10,${strength})`)
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h)
}

function splitWords(text: string): string[] { return text.match(/\S+/g) || [text] }

function calcFontSize(len: number, w: number, h: number): number {
  const base = Math.min(w * 0.09, h * 0.08, 76)
  if (len <= 8) return base * 1.5
  if (len <= 15) return base * 1.15
  if (len <= 30) return base * 0.85
  if (len <= 50) return base * 0.65
  return base * 0.5
}

function wrapWords(ctx: CanvasRenderingContext2D, words: string[], maxW: number): string[][] {
  const lines: string[][] = []; let cur: string[] = []; let curW = 0
  const sp = ctx.measureText(' ').width
  for (const w of words) {
    const ww = ctx.measureText(w).width
    if (cur.length && curW + sp + ww > maxW) { lines.push(cur); cur = [w]; curW = ww }
    else { cur.push(w); curW += (cur.length > 1 ? sp : 0) + ww }
  }
  if (cur.length) lines.push(cur); return lines
}

// ─── ANIMATION RENDERERS ───
function renderCinema(ctx: CanvasRenderingContext2D, w: number, h: number, text: string, words: string[], t: number, dust: Dust[]): boolean {
  const fs = calcFontSize(text.length, w, h)
  ctx.font = getSerifFont(400, fs, text)
  const lines = wrapWords(ctx, words, w * 0.72)
  const lh = fs * 1.6; const totalH = lines.length * lh
  const startY = (h - totalH) / 2 + fs * 0.4; const lbH = h * 0.11
  const dur = words.length * 0.8 + 3; const zoom = 1 + (t / dur) * 0.035
  ctx.save(); ctx.translate(w/2, h/2); ctx.scale(zoom, zoom); ctx.translate(-w/2, -h/2)
  let wi = 0
  for (let li = 0; li < lines.length; li++) {
    const line = lines[li]; ctx.font = getSerifFont(400, fs, text)
    const lineStr = line.join(' '); const lineW = ctx.measureText(lineStr).width
    let x = (w - lineW) / 2; const y = startY + li * lh
    for (const word of line) {
      const wt = Math.max(0, t - wi * 0.8); const fade = easeOutCubic(Math.min(1, wt / 0.6))
      const yOff = (1 - easeOutExpo(Math.min(1, wt / 0.7))) * 18
      ctx.save(); ctx.globalAlpha = fade; ctx.fillStyle = '#F5F5F0'
      ctx.font = getSerifFont(400, fs, text); ctx.textBaseline = 'alphabetic'
      ctx.fillText(word, x, y + yOff); ctx.restore()
      x += ctx.measureText(word + ' ').width; wi++
    }
  }
  ctx.restore(); tickDust(dust, w, h); drawDust(ctx, dust)
  ctx.fillStyle = '#0A0A0A'; ctx.fillRect(0, 0, w, lbH); ctx.fillRect(0, h - lbH, w, lbH)
  drawVignette(ctx, w, h, 0.55); return t > words.length * 0.8 + 1
}

function renderTypewriter(ctx: CanvasRenderingContext2D, w: number, h: number, text: string, words: string[], t: number, dust: Dust[]): boolean {
  const full = words.join(' '); const fs = calcFontSize(full.length, w, h) * 0.9
  const interval = 0.08; const vis = Math.min(full.length, Math.floor(t / interval))
  const display = full.slice(0, vis)
  const isNew = Math.floor(t / interval) !== Math.floor((t - 0.016) / interval)
  const sx = isNew ? (Math.random() - 0.5) * 1.2 : 0; const sy = isNew ? (Math.random() - 0.5) * 1.2 : 0
  ctx.save(); ctx.translate(sx, sy); ctx.font = getSerifFont(300, fs, text)
  const lines: string[] = []; let line = ''
  for (const ch of display) {
    const test = line + ch
    if (ctx.measureText(test).width > w * 0.78 && line) { lines.push(line); line = ch } else line = test
  }
  if (line) lines.push(line)
  const lh = fs * 1.6; const startY = (h - lines.length * lh) / 2 + fs
  ctx.fillStyle = '#F5F5F0'; ctx.textBaseline = 'alphabetic'
  for (let i = 0; i < lines.length; i++) {
    const lw = ctx.measureText(lines[i]).width; ctx.fillText(lines[i], (w - lw) / 2, startY + i * lh)
  }
  if (vis < full.length || Math.sin(t * 5) > 0) {
    const lastLine = lines[lines.length - 1] || ''; const lastW = ctx.measureText(lastLine).width
    const cx = (w - ctx.measureText(lastLine).width) / 2 + lastW + 4
    const cy = startY + (lines.length - 1) * lh
    ctx.globalAlpha = vis < full.length ? 0.9 : 0.6; ctx.fillRect(cx, cy - fs * 0.75, 1.5, fs * 0.85)
  }
  ctx.restore(); tickDust(dust, w, h); drawDust(ctx, dust); drawVignette(ctx, w, h, 0.45)
  return vis >= full.length && t > full.length * interval + 0.8
}

function renderFlicker(ctx: CanvasRenderingContext2D, w: number, h: number, text: string, words: string[], t: number, dust: Dust[]): boolean {
  const fs = calcFontSize(text.length, w, h); ctx.font = getSerifFont(600, fs, text)
  const lines = wrapWords(ctx, words, w * 0.72); const lh = fs * 1.6
  const startY = (h - lines.length * lh) / 2 + fs * 0.4
  const revealAlpha = easeOutCubic(Math.min(1, t / 1.5))
  const flickerAmt = t < 2 ? 0.15 * Math.sin(t * 30) * Math.sin(t * 17) * (1 - t / 2) : 0.03 * Math.sin(t * 12)
  const jitterY = t < 2.5 ? (Math.random() - 0.5) * 1.5 * (1 - t / 2.5) : 0
  ctx.save(); ctx.translate(0, jitterY); ctx.globalAlpha = revealAlpha * Math.max(0.3, 0.85 + flickerAmt)
  for (let li = 0; li < lines.length; li++) {
    const lineStr = lines[li].join(' '); ctx.font = getSerifFont(600, fs, text)
    const lineW = ctx.measureText(lineStr).width
    ctx.fillStyle = '#F5F5F0'; ctx.textBaseline = 'alphabetic'; ctx.fillText(lineStr, (w - lineW) / 2, startY + li * lh)
  }
  ctx.restore()
  if (Math.random() > 0.92) {
    ctx.strokeStyle = `rgba(245,245,240,${0.03 + Math.random() * 0.04})`; ctx.lineWidth = 0.5
    ctx.beginPath(); ctx.moveTo(0, Math.random() * h); ctx.lineTo(w, Math.random() * h); ctx.stroke()
  }
  tickDust(dust, w, h); drawDust(ctx, dust); drawVignette(ctx, w, h, 0.6); return t > 4
}

function renderWhisper(ctx: CanvasRenderingContext2D, w: number, h: number, text: string, words: string[], t: number, dust: Dust[]): boolean {
  const full = words.join(' '); const fs = calcFontSize(full.length, w, h)
  ctx.font = getSerifFont(300, fs, text); const maxW = w * 0.75; const lh = fs * 1.6
  const charPositions: { ch: string; x: number; y: number }[] = []
  let lineX = 0; const lineWidths: number[] = []; const lineChars: { ch: string; x: number }[][] = [[]]
  for (const ch of full) {
    const cw = ctx.measureText(ch).width
    if (lineX + cw > maxW && ch !== ' ' && lineX > 0) { lineWidths.push(lineX); lineX = 0; lineChars.push([]) }
    lineChars[lineChars.length - 1].push({ ch, x: lineX }); lineX += cw
  }
  lineWidths.push(lineX)
  const baseY = (h - lineWidths.length * lh) / 2 + fs * 0.4
  for (let li = 0; li < lineChars.length; li++) {
    const ox = (w - lineWidths[li]) / 2
    for (const { ch, x } of lineChars[li]) charPositions.push({ ch, x: ox + x, y: baseY + li * lh })
  }
  const charDelay = 0.06
  for (let i = 0; i < charPositions.length; i++) {
    const { ch, x, y } = charPositions[i]; const ct = Math.max(0, t - i * charDelay); if (ct <= 0) continue
    const fade = easeOutCubic(Math.min(1, ct / 0.5)); const drift = (1 - easeOutExpo(Math.min(1, ct / 0.8))) * 12
    const sway = Math.sin(t * 0.8 + i * 0.5) * 1.5 * Math.min(1, ct)
    ctx.save(); ctx.globalAlpha = fade * 0.95; ctx.fillStyle = '#F5F5F0'
    ctx.font = getSerifFont(300, fs, text); ctx.textBaseline = 'alphabetic'
    ctx.fillText(ch, x + sway, y + drift); ctx.restore()
  }
  tickDust(dust, w, h); drawDust(ctx, dust); drawVignette(ctx, w, h, 0.5)
  return t > charPositions.length * charDelay + 2
}

// ─── Render single frame ───
function renderFrame(ctx: CanvasRenderingContext2D, w: number, h: number, text: string, style: AnimationStyle, t: number, dust: Dust[], isReels: boolean): boolean {
  ctx.fillStyle = '#0A0A0A'; ctx.fillRect(0, 0, w, h)
  const words = splitWords(text)
  let done = false
  switch (style) {
    case 'cinema': done = renderCinema(ctx, w, h, text, words, t, dust); break
    case 'typewriter': done = renderTypewriter(ctx, w, h, text, words, t, dust); break
    case 'flicker': done = renderFlicker(ctx, w, h, text, words, t, dust); break
    case 'whisper': done = renderWhisper(ctx, w, h, text, words, t, dust); break
  }

  // Watermark — always show
  if (t > 1.0) {
    ctx.textAlign = 'center'; ctx.fillStyle = '#F5F5F0'
    const fadeIn = Math.min(1, (t - 1.0) * 0.4)

    if (isReels) {
      const s = Math.round(w * 0.026)
      // Top: End Of What
      ctx.globalAlpha = fadeIn * 0.25
      ctx.font = getSansFont(500, s)
      ctx.fillText('End Of What', w / 2, h * 0.055)
      // Tagline
      ctx.globalAlpha = fadeIn * 0.15
      ctx.font = getSansFont(400, Math.round(s * 0.55))
      ctx.fillText('마지막 한 문장을 써보세요', w / 2, h * 0.055 + s * 1.2)
      // Bottom: @jiwonnnnieee pill
      const pillFont = Math.round(s * 0.9)
      const pillText = '@jiwonnnnieee'
      ctx.font = getSansFont(600, pillFont)
      const pillW = ctx.measureText(pillText).width + pillFont * 2.5
      const pillH = pillFont * 2.2
      const pillX = (w - pillW) / 2
      const pillY = h - s * 5.5
      // Pill background
      ctx.globalAlpha = fadeIn * 0.35
      ctx.fillStyle = '#F5F5F0'
      const r = pillH / 2
      ctx.beginPath()
      ctx.moveTo(pillX + r, pillY); ctx.lineTo(pillX + pillW - r, pillY)
      ctx.arc(pillX + pillW - r, pillY + r, r, -Math.PI / 2, Math.PI / 2)
      ctx.lineTo(pillX + r, pillY + pillH)
      ctx.arc(pillX + r, pillY + r, r, Math.PI / 2, -Math.PI / 2)
      ctx.closePath(); ctx.fill()
      // Pill text
      ctx.globalAlpha = fadeIn * 0.9
      ctx.fillStyle = '#0A0A0A'
      ctx.font = getSansFont(600, pillFont)
      ctx.fillText(pillText, w / 2, pillY + pillH * 0.68)
      // URL pill below
      const urlFont = Math.round(s * 0.6)
      const urlText = 'so.now-then.dev/eow'
      ctx.font = getSansFont(400, urlFont)
      const urlPillW = ctx.measureText(urlText).width + urlFont * 2.5
      const urlPillH = urlFont * 2.2
      const urlPillX = (w - urlPillW) / 2
      const urlPillY = pillY + pillH + s * 0.6
      ctx.globalAlpha = fadeIn * 0.2
      ctx.fillStyle = '#F5F5F0'
      ctx.beginPath()
      const ur = urlPillH / 2
      ctx.moveTo(urlPillX + ur, urlPillY); ctx.lineTo(urlPillX + urlPillW - ur, urlPillY)
      ctx.arc(urlPillX + urlPillW - ur, urlPillY + ur, ur, -Math.PI / 2, Math.PI / 2)
      ctx.lineTo(urlPillX + ur, urlPillY + urlPillH)
      ctx.arc(urlPillX + ur, urlPillY + ur, ur, Math.PI / 2, -Math.PI / 2)
      ctx.closePath(); ctx.fill()
      ctx.globalAlpha = fadeIn * 0.7
      ctx.fillStyle = '#F5F5F0'
      ctx.font = getSansFont(400, urlFont)
      ctx.fillText(urlText, w / 2, urlPillY + urlPillH * 0.68)
    } else {
      // Normal playback — also show branding
      const a = fadeIn * 0.22
      ctx.globalAlpha = a
      ctx.font = getSansFont(400, 10)
      ctx.fillText('End Of What', w / 2, h - 38)
      ctx.globalAlpha = a * 0.9
      ctx.font = getSansFont(500, 9)
      ctx.fillText('@jiwonnnnieee', w / 2, h - 22)
    }

    ctx.textAlign = 'start'; ctx.globalAlpha = 1
  }

  return done
}

// ─── MAIN COMPONENT ───
export default function TypoAnimator({ text, style, onComplete, isPlaying }: TypoAnimatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const dustRef = useRef<Dust[]>([])
  const recDustRef = useRef<Dust[]>([])
  const startRef = useRef(0)
  const doneRef = useRef(false)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const recCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const blobRef = useRef<Blob | null>(null)

  // Canvas sizing
  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      c.width = window.innerWidth * dpr; c.height = window.innerHeight * dpr
      c.style.width = `${window.innerWidth}px`; c.style.height = `${window.innerHeight}px`
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  // ─── Play + background record ───
  useEffect(() => {
    if (!isPlaying || !canvasRef.current) return
    const c = canvasRef.current
    const ctx = c.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const w = c.width / dpr; const h = c.height / dpr

    dustRef.current = createDust(w, h, 35)
    startRef.current = performance.now()
    doneRef.current = false
    blobRef.current = null

    const words = splitWords(text)
    const fullText = words.join(' ')
    let lastSoundIdx = -1

    // Setup background 9:16 recording
    const recCanvas = document.createElement('canvas')
    recCanvas.width = 1080; recCanvas.height = 1920
    recCanvasRef.current = recCanvas
    const recCtx = recCanvas.getContext('2d')
    recDustRef.current = createDust(1080, 1920, 50)
    chunksRef.current = []

    let recorder: MediaRecorder | null = null
    try {
      const stream = recCanvas.captureStream(30)
      const mimeType = MediaRecorder.isTypeSupported('video/mp4') ? 'video/mp4'
        : MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9'
        : 'video/webm'
      recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 8_000_000 })
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType })
        blobRef.current = blob
      }
      recorder.start()
      recorderRef.current = recorder
    } catch { /* recording not supported */ }

    const frame = (now: number) => {
      const t = ((now - startRef.current) / 1000) * SPEED
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.scale(dpr, dpr)

      // Sounds
      if (style === 'cinema') {
        const idx = Math.floor(t / 0.8)
        if (idx > lastSoundIdx && idx < words.length) { lastSoundIdx = idx; playCinemaReveal() }
      } else if (style === 'typewriter') {
        const idx = Math.floor(t / 0.08)
        if (idx > lastSoundIdx && idx < fullText.length) { lastSoundIdx = idx; playTypewriterClack() }
      } else if (style === 'flicker') {
        if (lastSoundIdx === -1 && t > 0.1) { lastSoundIdx = 0; playFlickerTick() }
      } else if (style === 'whisper') {
        const idx = Math.floor(t / 0.06)
        if (idx > lastSoundIdx && idx < fullText.length && idx % 3 === 0) { lastSoundIdx = idx; playWhisperBreath() }
      }

      // Render main canvas
      tickDust(dustRef.current, w, h)
      const done = renderFrame(ctx, w, h, text, style, t, dustRef.current, false)

      // Render recording canvas in parallel
      if (recCtx) {
        recCtx.setTransform(1, 0, 0, 1, 0, 0)
        tickDust(recDustRef.current, 1080, 1920)
        renderFrame(recCtx, 1080, 1920, text, style, t, recDustRef.current, true)
      }

      if (done && !doneRef.current) {
        doneRef.current = true
        // Hold final frame on recording for 1.5s then stop
        setTimeout(() => {
          if (recorder && recorder.state !== 'inactive') recorder.stop()
          // Wait a bit for blob to be ready, then call onComplete
          setTimeout(() => onComplete?.(blobRef.current), 200)
        }, 1500)
      }

      if (!doneRef.current) {
        animRef.current = requestAnimationFrame(frame)
      } else {
        // Keep rendering main canvas (frozen last frame)
        animRef.current = requestAnimationFrame(frame)
      }
    }

    animRef.current = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(animRef.current)
      if (recorder && recorder.state !== 'inactive') recorder.stop()
    }
  }, [isPlaying, text, style, onComplete])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-50"
      style={{ background: '#0A0A0A' }}
    />
  )
}
