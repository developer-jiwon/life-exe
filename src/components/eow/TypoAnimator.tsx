'use client'

import { useEffect, useRef } from 'react'
import { playCinemaReveal, playTypewriterClack, playFlickerTick, playWhisperBreath } from '@/lib/eow-sound'

const SPEED = 1.0

type AnimationStyle = 'cinema' | 'typewriter' | 'flicker' | 'whisper'

interface TypoAnimatorProps {
  text: string
  style: AnimationStyle
  onComplete?: () => void
  isPlaying: boolean
  /** When true, renders in 9:16 Reels format and records */
  reelsMode?: boolean
  onReelsDone?: (blob: Blob) => void
}

// ─── UTILS ───

const easeOutExpo = (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

function hasKorean(text: string): boolean {
  return /[가-힣ㄱ-ㅎㅏ-ㅣ]/.test(text)
}

function getSerifFont(weight: number, size: number, text: string) {
  if (hasKorean(text)) {
    return `${weight} ${size}px "Noto Serif KR", "Cormorant Garamond", Georgia, serif`
  }
  return `${weight} ${size}px "Cormorant Garamond", "Noto Serif KR", Georgia, serif`
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
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(245,245,240,${p.o})`
    ctx.fill()
  }
}

function drawVignette(ctx: CanvasRenderingContext2D, w: number, h: number, strength = 0.55) {
  const g = ctx.createRadialGradient(w / 2, h / 2, w * 0.25, w / 2, h / 2, w * 0.85)
  g.addColorStop(0, 'rgba(10,10,10,0)')
  g.addColorStop(1, `rgba(10,10,10,${strength})`)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
}

function splitWords(text: string): string[] {
  return text.match(/\S+/g) || [text]
}

function calcFontSize(len: number, w: number, h: number): number {
  const base = Math.min(w * 0.09, h * 0.08, 76)
  if (len <= 8) return base * 1.5
  if (len <= 15) return base * 1.15
  if (len <= 30) return base * 0.85
  if (len <= 50) return base * 0.65
  return base * 0.5
}

function wrapWords(ctx: CanvasRenderingContext2D, words: string[], maxW: number): string[][] {
  const lines: string[][] = []
  let cur: string[] = []
  let curW = 0
  const sp = ctx.measureText(' ').width
  for (const w of words) {
    const ww = ctx.measureText(w).width
    if (cur.length && curW + sp + ww > maxW) {
      lines.push(cur); cur = [w]; curW = ww
    } else {
      cur.push(w); curW += (cur.length > 1 ? sp : 0) + ww
    }
  }
  if (cur.length) lines.push(cur)
  return lines
}

// ─── CINEMA ───
function renderCinema(ctx: CanvasRenderingContext2D, w: number, h: number, text: string, words: string[], t: number, dust: Dust[]): boolean {
  const fs = calcFontSize(text.length, w, h)
  ctx.font = getSerifFont(400, fs, text)
  const lines = wrapWords(ctx, words, w * 0.72)
  const lh = fs * 1.6
  const totalH = lines.length * lh
  const startY = (h - totalH) / 2 + fs * 0.4
  const lbH = h * 0.11
  const dur = words.length * 0.8 + 3
  const zoom = 1 + (t / dur) * 0.035
  ctx.save()
  ctx.translate(w / 2, h / 2); ctx.scale(zoom, zoom); ctx.translate(-w / 2, -h / 2)
  let wi = 0
  for (let li = 0; li < lines.length; li++) {
    const line = lines[li]
    ctx.font = getSerifFont(400, fs, text)
    const lineStr = line.join(' ')
    const lineW = ctx.measureText(lineStr).width
    let x = (w - lineW) / 2
    const y = startY + li * lh
    for (const word of line) {
      const wStart = wi * 0.8; const wt = Math.max(0, t - wStart)
      const fade = easeOutCubic(Math.min(1, wt / 0.6))
      const yOff = (1 - easeOutExpo(Math.min(1, wt / 0.7))) * 18
      ctx.save(); ctx.globalAlpha = fade; ctx.fillStyle = '#F5F5F0'
      ctx.font = getSerifFont(400, fs, text); ctx.textBaseline = 'alphabetic'
      ctx.fillText(word, x, y + yOff); ctx.restore()
      x += ctx.measureText(word + ' ').width; wi++
    }
  }
  ctx.restore()
  tickDust(dust, w, h); drawDust(ctx, dust)
  ctx.fillStyle = '#0A0A0A'; ctx.fillRect(0, 0, w, lbH); ctx.fillRect(0, h - lbH, w, lbH)
  drawVignette(ctx, w, h, 0.55)
  return t > words.length * 0.8 + 1
}

// ─── TYPEWRITER ───
function renderTypewriter(ctx: CanvasRenderingContext2D, w: number, h: number, text: string, words: string[], t: number, dust: Dust[]): boolean {
  const full = words.join(' ')
  const fs = calcFontSize(full.length, w, h) * 0.9
  const interval = 0.08
  const vis = Math.min(full.length, Math.floor(t / interval))
  const display = full.slice(0, vis)
  const isNew = Math.floor(t / interval) !== Math.floor((t - 0.016) / interval)
  const sx = isNew ? (Math.random() - 0.5) * 1.2 : 0
  const sy = isNew ? (Math.random() - 0.5) * 1.2 : 0
  ctx.save(); ctx.translate(sx, sy)
  ctx.font = getSerifFont(300, fs, text)
  const lines: string[] = []
  let line = ''
  for (const ch of display) {
    const test = line + ch
    if (ctx.measureText(test).width > w * 0.78 && line) { lines.push(line); line = ch }
    else line = test
  }
  if (line) lines.push(line)
  const lh = fs * 1.6; const totalH = lines.length * lh; const startY = (h - totalH) / 2 + fs
  ctx.fillStyle = '#F5F5F0'; ctx.textBaseline = 'alphabetic'
  for (let i = 0; i < lines.length; i++) {
    const lw = ctx.measureText(lines[i]).width
    ctx.fillText(lines[i], (w - lw) / 2, startY + i * lh)
  }
  const cursorOn = vis < full.length || Math.sin(t * 5) > 0
  if (cursorOn) {
    const lastLine = lines[lines.length - 1] || ''
    const lastW = ctx.measureText(lastLine).width
    const cx = (w - ctx.measureText(lastLine).width) / 2 + lastW + 4
    const cy = startY + (lines.length - 1) * lh
    ctx.globalAlpha = vis < full.length ? 0.9 : 0.6
    ctx.fillRect(cx, cy - fs * 0.75, 1.5, fs * 0.85)
  }
  ctx.restore()
  tickDust(dust, w, h); drawDust(ctx, dust); drawVignette(ctx, w, h, 0.45)
  return vis >= full.length && t > full.length * interval + 0.8
}

// ─── FLICKER ───
function renderFlicker(ctx: CanvasRenderingContext2D, w: number, h: number, text: string, words: string[], t: number, dust: Dust[]): boolean {
  const fs = calcFontSize(text.length, w, h)
  ctx.font = getSerifFont(600, fs, text)
  const lines = wrapWords(ctx, words, w * 0.72)
  const lh = fs * 1.6; const totalH = lines.length * lh; const startY = (h - totalH) / 2 + fs * 0.4
  const revealAlpha = easeOutCubic(Math.min(1, t / 1.5))
  const flickerBase = 0.85
  const flickerAmt = t < 2 ? 0.15 * Math.sin(t * 30) * Math.sin(t * 17) * (1 - t / 2) : 0.03 * Math.sin(t * 12)
  const flicker = flickerBase + flickerAmt
  const jitterY = t < 2.5 ? (Math.random() - 0.5) * 1.5 * (1 - t / 2.5) : 0
  ctx.save(); ctx.translate(0, jitterY); ctx.globalAlpha = revealAlpha * Math.max(0.3, flicker)
  for (let li = 0; li < lines.length; li++) {
    const lineStr = lines[li].join(' ')
    ctx.font = getSerifFont(600, fs, text)
    const lineW = ctx.measureText(lineStr).width
    ctx.fillStyle = '#F5F5F0'; ctx.textBaseline = 'alphabetic'
    ctx.fillText(lineStr, (w - lineW) / 2, startY + li * lh)
  }
  ctx.restore()
  if (Math.random() > 0.92) {
    const scratchY = Math.random() * h
    ctx.strokeStyle = `rgba(245,245,240,${0.03 + Math.random() * 0.04})`
    ctx.lineWidth = 0.5; ctx.beginPath(); ctx.moveTo(0, scratchY); ctx.lineTo(w, scratchY); ctx.stroke()
  }
  tickDust(dust, w, h); drawDust(ctx, dust); drawVignette(ctx, w, h, 0.6)
  return t > 4
}

// ─── WHISPER ───
function renderWhisper(ctx: CanvasRenderingContext2D, w: number, h: number, text: string, words: string[], t: number, dust: Dust[]): boolean {
  const full = words.join(' ')
  const fs = calcFontSize(full.length, w, h)
  ctx.font = getSerifFont(300, fs, text)
  const maxW = w * 0.75; const lh = fs * 1.6
  const charPositions: { ch: string; x: number; y: number }[] = []
  let lineX = 0; let lineY = 0; const lineWidths: number[] = []; const lineChars: { ch: string; x: number }[][] = [[]]
  for (const ch of full) {
    const cw = ctx.measureText(ch).width
    if (lineX + cw > maxW && ch !== ' ' && lineX > 0) { lineWidths.push(lineX); lineX = 0; lineY += lh; lineChars.push([]) }
    lineChars[lineChars.length - 1].push({ ch, x: lineX }); lineX += cw
  }
  lineWidths.push(lineX)
  const totalH = lineWidths.length * lh; const baseY = (h - totalH) / 2 + fs * 0.4
  for (let li = 0; li < lineChars.length; li++) {
    const lw = lineWidths[li]; const ox = (w - lw) / 2
    for (const { ch, x } of lineChars[li]) { charPositions.push({ ch, x: ox + x, y: baseY + li * lh }) }
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

// ─── Render frame + watermark ───
function renderFrame(
  ctx: CanvasRenderingContext2D, w: number, h: number,
  text: string, style: AnimationStyle, t: number, dust: Dust[],
  isReels = false
): boolean {
  ctx.fillStyle = '#0A0A0A'
  ctx.fillRect(0, 0, w, h)
  const words = splitWords(text)

  let done = false
  switch (style) {
    case 'cinema': done = renderCinema(ctx, w, h, text, words, t, dust); break
    case 'typewriter': done = renderTypewriter(ctx, w, h, text, words, t, dust); break
    case 'flicker': done = renderFlicker(ctx, w, h, text, words, t, dust); break
    case 'whisper': done = renderWhisper(ctx, w, h, text, words, t, dust); break
  }

  // Watermark
  if (t > 1.2) {
    ctx.textAlign = 'center'
    ctx.fillStyle = '#F5F5F0'

    if (isReels) {
      const fadeIn = Math.min(1, (t - 1.2) * 0.5)
      const baseSize = Math.round(w * 0.028)
      // Top
      ctx.globalAlpha = fadeIn * 0.2
      ctx.font = getSansFont(500, baseSize)
      ctx.fillText('End Of What', w / 2, h * 0.06)
      // Bottom
      ctx.globalAlpha = fadeIn * 0.4
      ctx.font = getSansFont(600, baseSize)
      ctx.fillText('@jiwonnnnieee', w / 2, h - baseSize * 4)
      ctx.globalAlpha = fadeIn * 0.3
      ctx.font = getSansFont(400, Math.round(baseSize * 0.7))
      ctx.fillText('so.now-then.dev/eow', w / 2, h - baseSize * 2)
    } else {
      const a = Math.min(0.22, (t - 1.2) * 0.06)
      ctx.globalAlpha = a
      ctx.font = getSansFont(400, 10)
      ctx.fillText('End Of What', w / 2, h - 32)
      ctx.globalAlpha = a * 0.8
      ctx.font = getSansFont(500, 9)
      ctx.fillText('@jiwonnnnieee', w / 2, h - 16)
    }

    ctx.textAlign = 'start'
    ctx.globalAlpha = 1
  }

  return done
}

// ─── MAIN ───
export default function TypoAnimator({ text, style, onComplete, isPlaying, reelsMode, onReelsDone }: TypoAnimatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const dustRef = useRef<Dust[]>([])
  const startRef = useRef(0)
  const doneRef = useRef(false)

  // Canvas sizing
  useEffect(() => {
    const c = canvasRef.current
    if (!c) return

    if (reelsMode) {
      // Fixed 9:16 for Reels
      c.width = 1080
      c.height = 1920
      // Display size — fit in viewport
      const vh = window.innerHeight * 0.85
      const displayH = vh
      const displayW = displayH * (9 / 16)
      c.style.width = `${displayW}px`
      c.style.height = `${displayH}px`
      return
    }

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      c.width = window.innerWidth * dpr
      c.height = window.innerHeight * dpr
      c.style.width = `${window.innerWidth}px`
      c.style.height = `${window.innerHeight}px`
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [reelsMode])

  // ─── Reels recording ───
  useEffect(() => {
    if (!reelsMode || !isPlaying || !canvasRef.current || !onReelsDone) return
    const c = canvasRef.current
    const ctx = c.getContext('2d')
    if (!ctx) return

    const w = 1080
    const h = 1920
    const dust = createDust(w, h, 50)
    const startTime = performance.now()
    let recDone = false

    // Setup recorder on the visible canvas
    const stream = c.captureStream(30)
    const mimeType = MediaRecorder.isTypeSupported('video/mp4')
      ? 'video/mp4'
      : MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm'
    const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 8_000_000 })
    const chunks: Blob[] = []

    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data) }
    recorder.onstop = () => {
      const ext = mimeType.includes('mp4') ? 'mp4' : 'webm'
      const blob = new Blob(chunks, { type: mimeType })
      onReelsDone(blob)
    }

    recorder.start()

    const frame = () => {
      if (recDone) return
      const t = ((performance.now() - startTime) / 1000) * SPEED
      ctx.setTransform(1, 0, 0, 1, 0, 0)

      tickDust(dust, w, h)
      const done = renderFrame(ctx, w, h, text, style, t, dust, true)

      if (done) {
        // Hold final frame 1.5s then stop
        setTimeout(() => {
          recDone = true
          if (recorder.state !== 'inactive') recorder.stop()
        }, 1500)
        return
      }

      animRef.current = requestAnimationFrame(frame)
    }

    animRef.current = requestAnimationFrame(frame)

    return () => {
      recDone = true
      cancelAnimationFrame(animRef.current)
      if (recorder.state !== 'inactive') recorder.stop()
    }
  }, [reelsMode, isPlaying, text, style, onReelsDone])

  // ─── Normal playback ───
  useEffect(() => {
    if (reelsMode || !isPlaying || !canvasRef.current) return
    const c = canvasRef.current
    const ctx = c.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const w = c.width / dpr
    const h = c.height / dpr

    dustRef.current = createDust(w, h, 35)
    startRef.current = performance.now()
    doneRef.current = false

    const words = splitWords(text)
    const fullText = words.join(' ')
    let lastSoundIdx = -1

    const frame = (now: number) => {
      const t = ((now - startRef.current) / 1000) * SPEED
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)

      if (style === 'cinema') {
        const wordIdx = Math.floor(t / 0.8)
        if (wordIdx > lastSoundIdx && wordIdx < words.length) { lastSoundIdx = wordIdx; playCinemaReveal() }
      } else if (style === 'typewriter') {
        const charIdx = Math.floor(t / 0.08)
        if (charIdx > lastSoundIdx && charIdx < fullText.length) { lastSoundIdx = charIdx; playTypewriterClack() }
      } else if (style === 'flicker') {
        if (lastSoundIdx === -1 && t > 0.1) { lastSoundIdx = 0; playFlickerTick() }
      } else if (style === 'whisper') {
        const charIdx = Math.floor(t / 0.06)
        if (charIdx > lastSoundIdx && charIdx < fullText.length && charIdx % 3 === 0) { lastSoundIdx = charIdx; playWhisperBreath() }
      }

      tickDust(dustRef.current, w, h)
      const done = renderFrame(ctx, w, h, text, style, t, dustRef.current)

      if (done && !doneRef.current) {
        doneRef.current = true
        onComplete?.()
      }

      animRef.current = requestAnimationFrame(frame)
    }

    animRef.current = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(animRef.current)
  }, [reelsMode, isPlaying, text, style, onComplete])

  if (reelsMode) {
    return (
      <div className="fixed inset-0 z-50 bg-[#0A0A0A] flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="rounded-2xl"
          style={{ boxShadow: '0 0 60px rgba(0,0,0,0.5)' }}
        />
      </div>
    )
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-50"
      style={{ background: '#0A0A0A' }}
    />
  )
}
