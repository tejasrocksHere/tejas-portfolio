// Self-contained Web Audio API cosmic sound synthesizer
class SoundEffects {
  constructor() {
    this.ctx = null
    this.isMuted = false
    this.humOsc = null
    this.humGain = null
    this.noiseNode = null
    this.noiseGain = null
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  playSingularityIgnite() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return

    const now = this.ctx.currentTime

    // 1. Deep sub-bass drop (gravitational collapse)
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(140, now)
    osc.frequency.exponentialRampToValueAtTime(32, now + 1.2)

    gain.gain.setValueAtTime(0.4, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 2.0)

    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start(now)
    osc.stop(now + 2.0)

    // 2. High-energy accretion hum
    this.startSingularityHum()
  }

  startSingularityHum() {
    if (this.isMuted || !this.ctx || this.humOsc) return
    const now = this.ctx.currentTime

    this.humOsc = this.ctx.createOscillator()
    this.humGain = this.ctx.createGain()

    this.humOsc.type = 'sawtooth'
    this.humOsc.frequency.setValueAtTime(45, now)

    // Low-pass filter for deep cosmic drone
    const filter = this.ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(160, now)

    this.humGain.gain.setValueAtTime(0.001, now)
    this.humGain.gain.linearRampToValueAtTime(0.12, now + 0.8)

    this.humOsc.connect(filter)
    filter.connect(this.humGain)
    this.humGain.connect(this.ctx.destination)
    this.humOsc.start(now)
  }

  stopSingularityHum() {
    if (this.humGain && this.ctx) {
      const now = this.ctx.currentTime
      this.humGain.gain.linearRampToValueAtTime(0.0001, now + 0.5)
      setTimeout(() => {
        if (this.humOsc) {
          try { this.humOsc.stop() } catch (_) {}
          this.humOsc = null
          this.humGain = null
        }
      }, 550)
    }
  }

  playRestoreSupernova() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return

    this.stopSingularityHum()

    const now = this.ctx.currentTime

    // White hole cosmic flash sound: rising pitch then crystal decay
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(60, now)
    osc.frequency.exponentialRampToValueAtTime(620, now + 0.4)
    osc.frequency.exponentialRampToValueAtTime(180, now + 1.5)

    gain.gain.setValueAtTime(0.35, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.6)

    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start(now)
    osc.stop(now + 1.6)
  }

  toggleMute() {
    this.isMuted = !this.isMuted
    if (this.isMuted) {
      this.stopSingularityHum()
    }
    return this.isMuted
  }
}

export const soundFx = new SoundEffects()
