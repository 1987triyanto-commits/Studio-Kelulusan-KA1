/**
 * Web Audio API based Cinematic Orchestra & Piano Soundtrack Generator.
 * Provides a warm, inspirational, emotional soundtrack for SDN Karang Anyar 01 Pagi video.
 */

class CinematicSoundtrack {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private intervalId: any = null;
  private step: number = 0;
  private volumeNode: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;

  // Emotional chord progression in A minor / C major:
  // Am (A-C-E) -> F (F-A-C) -> C (C-E-G) -> G (G-B-D)
  private chords = [
    [110.00, 130.81, 164.81], // Am (A2, C3, E3)
    [87.31, 130.81, 174.61],  // F (F2, C3, F3)
    [130.81, 164.81, 196.00], // C (C3, E3, G3)
    [98.00, 146.83, 196.00],  // G (G2, D3, G3)
  ];

  private melodies = [
    [440.00, 493.88, 523.25, 587.33, 659.25], // high notes for Am
    [349.23, 440.00, 523.25, 698.46, 523.25], // high notes for F
    [523.25, 587.33, 659.25, 783.99, 659.25], // high notes for C
    [392.00, 493.88, 587.33, 783.99, 587.33], // high notes for G
  ];

  start() {
    if (this.ctx && this.isPlaying) return;

    // Create audio context on user interaction
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    this.ctx = new AudioContextClass();
    this.isPlaying = true;

    // Build processing graph: Oscillators -> Lowpass Filter -> Volume -> Destination
    this.filterNode = this.ctx.createBiquadFilter();
    this.filterNode.type = "lowpass";
    this.filterNode.frequency.setValueAtTime(600, this.ctx.currentTime); // Soft, warm filter

    this.volumeNode = this.ctx.createGain();
    this.volumeNode.gain.setValueAtTime(0.001, this.ctx.currentTime);
    // Smooth fade in
    this.volumeNode.gain.linearRampToValueAtTime(0.5, this.ctx.currentTime + 3.0);

    this.filterNode.connect(this.volumeNode);
    this.volumeNode.connect(this.ctx.destination);

    // Warm, sweeping filter frequency lfo
    this.oscillateFilter();

    this.step = 0;
    this.playLoopBlock();

    // Loop every 4 seconds (one chord block)
    this.intervalId = setInterval(() => {
      this.playLoopBlock();
    }, 4000);
  }

  private oscillateFilter() {
    if (!this.ctx || !this.filterNode) return;
    const now = this.ctx.currentTime;
    // Sweep the cutoff up and down slowly over 16 seconds to resemble sweeping string pads
    this.filterNode.frequency.setValueAtTime(450, now);
    this.filterNode.frequency.linearRampToValueAtTime(800, now + 8.0);
    this.filterNode.frequency.linearRampToValueAtTime(450, now + 16.0);
    
    setTimeout(() => {
      if (this.isPlaying) this.oscillateFilter();
    }, 16000);
  }

  private playLoopBlock() {
    if (!this.ctx || !this.isPlaying || !this.filterNode) return;

    const chordIdx = this.step % this.chords.length;
    const chord = this.chords[chordIdx];
    const melodyOpts = this.melodies[chordIdx];
    const now = this.ctx.currentTime;

    // ---- STRING PAD LAYER (CHORDS) ----
    chord.forEach((freq) => {
      if (!this.ctx || !this.filterNode) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Soft triangle and sawtooth blend for a warmer bowed-string resemblance
      osc.type = Math.random() > 0.5 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 1.2); // gradual swell
      gain.gain.linearRampToValueAtTime(0.05, now + 2.8); // slight decay
      gain.gain.linearRampToValueAtTime(0, now + 4.0);     // slow release

      osc.connect(gain);
      gain.connect(this.filterNode);
      osc.start(now);
      osc.stop(now + 4.2);
    });

    // ---- MOTIVATIONAL PIANO NOTES ----
    // Play 4 scattered high piano melody notes during this 4s block
    for (let i = 0; i < 4; i++) {
      const timeOffset = i * 1.0 + Math.random() * 0.2;
      const noteFreq = melodyOpts[Math.floor(Math.random() * melodyOpts.length)];
      
      this.playPianoNote(noteFreq, now + timeOffset);
    }

    this.step++;
  }

  private playPianoNote(frequency: number, time: number) {
    if (!this.ctx || !this.filterNode) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Triangle wave with a bit of sine creates a beautiful bell-like warm acoustic piano sound
    osc.type = "triangle";
    osc.frequency.setValueAtTime(frequency, time);

    // Fine frequency tuning to make it sound richer
    osc.detune.setValueAtTime(Math.random() * 6 - 3, time);

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.12, time + 0.05); // sharp attack
    gain.gain.exponentialRampToValueAtTime(0.001, time + 1.8); // long decay

    osc.connect(gain);
    gain.connect(this.filterNode);
    osc.start(time);
    osc.stop(time + 2.0);
  }

  setVolume(volume: number) {
    if (!this.ctx || !this.volumeNode) return;
    this.volumeNode.gain.setValueAtTime(volume, this.ctx.currentTime);
  }

  stop() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.volumeNode && this.ctx) {
      this.volumeNode.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5); // Fade out
      setTimeout(() => {
        if (this.ctx) {
          this.ctx.close();
          this.ctx = null;
        }
      }, 600);
    }
  }

  getIsPlaying() {
    return this.isPlaying;
  }
}

export const soundtrack = new CinematicSoundtrack();
