'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import TypoAnimator from './TypoAnimator'
import TicketNotice from './TicketNotice'
import SentenceWall from './SentenceWall'
import { playTypeClick } from '@/lib/eow-sound'
import { saveSentence } from '@/lib/eow-storage'

export default function EOWApp() {
  const [text, setText] = useState('')
  const [phase, setPhase] = useState<'notice' | 'idle' | 'playing' | 'done' | 'share'>('notice')
  const [reelsReady, setReelsReady] = useState(false)
  const [playingText, setPlayingText] = useState('')
  const [copied, setCopied] = useState(false)
  const [playKey, setPlayKey] = useState(0)
  const reelsBlobRef = useRef<Blob | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const t = params.get('t')
    if (t) {
      setText(t)
      setPlayingText(t)
      setPlayKey(Date.now())
      setPhase('playing')
    }
  }, [])

  const play = useCallback((sentence?: string) => {
    const val = (sentence || text).trim()
    if (!val) return
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      const ctx = new AudioCtx(); ctx.resume().then(() => ctx.close())
    } catch { /* ignore */ }
    saveSentence(val)
    setPlayingText(val)
    setPlayKey(prev => prev + 1)
    reelsBlobRef.current = null
    setReelsReady(false)
    setPhase('playing')
  }, [text])

  const shareUrl = playingText
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/eow?t=${encodeURIComponent(playingText)}`
    : ''

  const handleComplete = useCallback((blob: Blob | null) => {
    reelsBlobRef.current = blob
    setReelsReady(true)
    setPhase('done')
  }, [])

  const shareToReels = useCallback(() => {
    const blob = reelsBlobRef.current
    if (!blob) return

    const ext = blob.type.includes('mp4') ? 'mp4' : 'webm'
    const file = new File([blob], `eow.${ext}`, { type: blob.type })

    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      navigator.share({
        files: [file],
        title: 'End Of What',
        text: `"${playingText}"\n\n@jiwonnnnieee\nso.now-then.dev/eow`,
      }).catch(() => {})
    } else {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a'); a.href = url; a.download = `eow.${ext}`; a.click()
      setTimeout(() => URL.revokeObjectURL(url), 3000)
    }
  }, [playingText])

  const resetToIdle = useCallback(() => {
    setPhase('idle'); setText(''); setPlayingText(''); reelsBlobRef.current = null
    window.history.replaceState(null, '', '/eow')
  }, [])

  const fontJ = { fontFamily: 'var(--font-jakarta)' }

  // ─── NOTICE (매번 표시) ───
  if (phase === 'notice') {
    return (
      <div className="fixed inset-0 bg-[#0A0A0A]">
        <TicketNotice onAccept={() => setPhase('idle')} />
      </div>
    )
  }

  // ─── SHARE (link) ───
  if (phase === 'share') {
    return (
      <div className="fixed inset-0 bg-[#0A0A0A] flex flex-col items-center justify-center px-6">
        <button onClick={() => setPhase('done')} className="absolute top-5 right-5 text-[#555] hover:text-[#999] text-[18px]">✕</button>
        <div className="w-full max-w-[400px] animate-fade-in">
          <div className="relative bg-[#F5F5F0] mx-auto">
            <div className="absolute -top-[6px] left-0 right-0 h-[6px] overflow-hidden">
              <svg width="100%" height="6" preserveAspectRatio="none" viewBox="0 0 400 6"><path d="M0,6 L0,3 Q10,0 20,3 Q30,6 40,3 Q50,0 60,3 Q70,6 80,3 Q90,0 100,3 Q110,6 120,3 Q130,0 140,3 Q150,6 160,3 Q170,0 180,3 Q190,6 200,3 Q210,0 220,3 Q230,6 240,3 Q250,0 260,3 Q270,6 280,3 Q290,0 300,3 Q310,6 320,3 Q330,0 340,3 Q350,6 360,3 Q370,0 380,3 Q390,6 400,3 L400,6 Z" fill="#F5F5F0" /></svg>
            </div>
            <div className="px-8 pt-10 pb-6">
              <p className="text-[10px] tracking-[0.25em] uppercase text-[#999] mb-6" style={fontJ}>End Of What</p>
              <p className="text-[20px] font-medium text-[#0A0A0A] leading-relaxed break-keep" style={{ fontFamily: 'var(--font-noto-serif), var(--font-cormorant), serif' }}>&ldquo;{playingText}&rdquo;</p>
            </div>
            <div className="mx-5 border-t border-dashed border-[#D0D0C8]" />
            <div className="px-8 py-4 flex items-center justify-between">
              <span className="text-[9px] text-[#BBB] tracking-wider" style={fontJ}>so.now-then.dev/eow</span>
              <span className="text-[9px] text-[#BBB]" style={fontJ}>@jiwonnnnieee</span>
            </div>
            <div className="absolute -bottom-[6px] left-0 right-0 h-[6px] overflow-hidden">
              <svg width="100%" height="6" preserveAspectRatio="none" viewBox="0 0 400 6"><path d="M0,0 L0,3 Q10,6 20,3 Q30,0 40,3 Q50,6 60,3 Q70,0 80,3 Q90,6 100,3 Q110,0 120,3 Q130,6 140,3 Q150,0 160,3 Q170,6 180,3 Q190,0 200,3 Q210,6 220,3 Q230,0 240,3 Q250,6 260,3 Q270,0 280,3 Q290,6 300,3 Q310,0 320,3 Q330,6 340,3 Q350,0 360,3 Q370,6 380,3 Q390,0 400,3 L400,0 Z" fill="#F5F5F0" /></svg>
            </div>
          </div>
          <div className="mt-10 flex flex-col gap-3">
            <button onClick={() => { navigator.clipboard.writeText(shareUrl).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) }).catch(() => {}) }} className="w-full py-3.5 rounded-full text-[10px] tracking-widest uppercase transition-all active:scale-[0.98] bg-[#F5F5F0] text-[#0A0A0A]" style={fontJ}>{copied ? 'Copied!' : 'Copy Link'}</button>
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button onClick={() => navigator.share({ title: 'End Of What', text: `"${playingText}"\n\n@jiwonnnnieee\nso.now-then.dev/eow`, url: shareUrl }).catch(() => {})} className="w-full py-3 rounded-full text-[10px] tracking-widest uppercase transition-all active:scale-[0.98] border border-[#F5F5F0]/30 text-[#F5F5F0]/60 hover:text-[#F5F5F0]" style={fontJ}>Share Link</button>
            )}
          </div>
          <div className="mt-8 flex justify-center gap-6">
            <button onClick={() => play()} className="text-[10px] text-[#555] hover:text-[#999] tracking-wider uppercase" style={fontJ}>Replay</button>
            <button onClick={resetToIdle} className="text-[10px] text-[#555] hover:text-[#999] tracking-wider uppercase" style={fontJ}>New</button>
          </div>
        </div>
      </div>
    )
  }

  // ─── PLAYING / DONE ───
  if (phase === 'playing' || phase === 'done') {
    return (
      <div className="fixed inset-0">
        <TypoAnimator
          key={playKey}
          text={playingText}
          style="typewriter"
          isPlaying={phase === 'playing'}
          onComplete={handleComplete}
        />

        {phase === 'done' && (
          <div className="fixed inset-0 z-[60] flex flex-col items-center justify-end pb-14 animate-fade-in">
            <div className="flex flex-col items-center gap-3 w-full max-w-[320px] px-4">
              <button
                onClick={shareToReels}
                className="w-full py-3 rounded-full text-[10px] tracking-widest uppercase transition-all active:scale-[0.98] font-medium bg-[#F5F5F0] text-[#0A0A0A]"
                style={fontJ}
              >
                Share to Reels
              </button>
              <div className="flex gap-3 w-full">
                <button onClick={() => play()} className="flex-1 py-2.5 rounded-full text-[10px] tracking-widest uppercase border border-[#F5F5F0]/30 text-[#F5F5F0]/60 hover:border-[#F5F5F0]/60 hover:text-[#F5F5F0] transition-all" style={fontJ}>Replay</button>
                <button onClick={resetToIdle} className="flex-1 py-2.5 rounded-full text-[10px] tracking-widest uppercase border border-[#F5F5F0]/30 text-[#F5F5F0]/60 hover:border-[#F5F5F0]/60 hover:text-[#F5F5F0] transition-all" style={fontJ}>New</button>
                <button onClick={() => setPhase('share')} className="flex-1 py-2.5 rounded-full text-[10px] tracking-widest uppercase border border-[#F5F5F0]/30 text-[#F5F5F0]/60 hover:border-[#F5F5F0]/60 hover:text-[#F5F5F0] transition-all" style={fontJ}>Link</button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ─── IDLE ───
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-[720px] mx-auto px-5 py-4 flex items-center justify-between">
        <a href="/" className="text-[10px] text-[#444] tracking-wider uppercase hover:text-[#666] transition-colors" style={fontJ}>Life.exe</a>
        <a href="https://www.threads.com/@jiwonnnnieee" target="_blank" rel="noopener noreferrer" className="text-[10px] tracking-wider px-3 py-1.5 rounded-full bg-[#F5F5F0] text-[#0A0A0A] font-medium hover:bg-[#E0E0D8] transition-colors" style={fontJ}>@jiwonnnnieee</a>
      </div>

      <div className="flex flex-col items-center justify-center px-6 pt-16 pb-20">
        <div className="w-full max-w-[480px]">
          <div className="text-center mb-10">
            <h1 className="text-[26px] tracking-[0.3em] uppercase text-[#C0C0C0] mb-2.5" style={fontJ}>End Of What</h1>
            <p className="text-[11px] text-[#888]">오늘의 한 줄을 남겨보세요</p>
          </div>

          <div className="relative mb-8">
            <textarea
              value={text}
              onChange={(e) => { setText(e.target.value.slice(0, 100)); playTypeClick() }}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); play() } }}
              placeholder="여기에 쓰세요"
              maxLength={100}
              rows={3}
              autoFocus
              className="eow-serif w-full bg-transparent text-[#F5F5F0] text-center text-[22px] font-medium leading-relaxed placeholder:text-[#2A2A2A] border-none outline-none resize-none caret-[#555]"
            />
            <div className="absolute -bottom-4 right-0 text-[9px] text-[#333]" style={fontJ}>{text.length}/100</div>
          </div>

          <div className="text-center">
            <button onMouseDown={(e) => { e.preventDefault(); play() }} className="px-8 py-2.5 text-[11px] tracking-widest uppercase border border-[#F5F5F0] text-[#F5F5F0] rounded-full hover:bg-[#F5F5F0] hover:text-[#0A0A0A] active:scale-95 transition-all duration-300 select-none" style={fontJ}>Play</button>
            <p className="text-[9px] text-[#333] mt-3">Enter ↵ · Shift+Enter 줄바꿈</p>
          </div>
        </div>
      </div>

      <div className="max-w-[720px] mx-auto px-5"><div className="border-t border-[#1A1A1A]" /></div>

      <div className="text-center pt-10 pb-6">
        <p className="text-[10px] tracking-[0.15em] uppercase text-[#444]" style={fontJ}>Being added by the developer</p>
      </div>

      <SentenceWall onSentenceClick={(s) => play(s)} refreshKey={playKey} />

      <div className="text-center py-12">
        <p className="text-[9px] text-[#2A2A2A]" style={fontJ}>End Of What — @jiwonnnnieee</p>
      </div>
    </div>
  )
}
