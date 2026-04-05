// Web Audio API — $0, no external files

let audioCtx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext()
  if (audioCtx.state === 'suspended') audioCtx.resume()
  return audioCtx
}

// ─── TYPING SOUND ───
// Subtle mechanical key click
export function playTypeClick() {
  try {
    const ctx = getCtx()
    const t = ctx.currentTime

    // Click: short noise burst
    const bufferSize = ctx.sampleRate * 0.025 // 25ms
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      // Noise that decays quickly
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 8)
    }

    const source = ctx.createBufferSource()
    source.buffer = buffer

    // Filter to make it sound like a key, not static
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 1800 + Math.random() * 400 // slight variation
    filter.Q.value = 1.5

    const gain = ctx.createGain()
    gain.gain.value = 0.08 + Math.random() * 0.03 // subtle volume variation

    source.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    source.start(t)
    source.stop(t + 0.025)
  } catch {}
}

// ─── ANIMATION SOUNDS ───

// Cinema: deep low rumble on word appear
export function playCinemaReveal() {
  try {
    const ctx = getCtx()
    const t = ctx.currentTime

    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(60, t)
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.4)

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.06, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(t)
    osc.stop(t + 0.5)
  } catch {}
}

// Typewriter: mechanical clack
export function playTypewriterClack() {
  try {
    const ctx = getCtx()
    const t = ctx.currentTime

    const bufferSize = ctx.sampleRate * 0.04
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      const env = Math.pow(1 - i / bufferSize, 12)
      data[i] = (Math.random() * 2 - 1) * env
    }

    const source = ctx.createBufferSource()
    source.buffer = buffer

    const filter = ctx.createBiquadFilter()
    filter.type = 'highpass'
    filter.frequency.value = 2000

    const gain = ctx.createGain()
    gain.gain.value = 0.12

    source.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    source.start(t)
    source.stop(t + 0.04)
  } catch {}
}

// Flicker: film projector hum + tick
export function playFlickerTick() {
  try {
    const ctx = getCtx()
    const t = ctx.currentTime

    // Tick
    const osc = ctx.createOscillator()
    osc.type = 'square'
    osc.frequency.value = 120

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.03, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(t)
    osc.stop(t + 0.08)
  } catch {}
}

// Whisper: soft breathy pad
export function playWhisperBreath() {
  try {
    const ctx = getCtx()
    const t = ctx.currentTime

    const bufferSize = ctx.sampleRate * 0.3
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      const env = Math.sin((i / bufferSize) * Math.PI) // bell curve
      data[i] = (Math.random() * 2 - 1) * env
    }

    const source = ctx.createBufferSource()
    source.buffer = buffer

    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 800
    filter.Q.value = 0.5

    const gain = ctx.createGain()
    gain.gain.value = 0.025

    source.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    source.start(t)
    source.stop(t + 0.3)
  } catch {}
}

// Complete: soft chime
export function playComplete() {
  try {
    const ctx = getCtx()
    const t = ctx.currentTime

    const notes = [523.25, 659.25, 783.99] // C5, E5, G5
    for (let i = 0; i < notes.length; i++) {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = notes[i]

      const gain = ctx.createGain()
      const start = t + i * 0.12
      gain.gain.setValueAtTime(0, start)
      gain.gain.linearRampToValueAtTime(0.04, start + 0.05)
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.8)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(start)
      osc.stop(start + 0.8)
    }
  } catch {}
}
