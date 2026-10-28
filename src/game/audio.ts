/**
 * Web Audio API 8-Bit Retro Sound Synthesizer
 * Generates authentic chiptune audio, sound effects and background music
 */

const BGM_URL = '/assets/aistudio/Pac_Baby__3_Minutes__-_Pac-Man_CE_2_Music_e5c25760.mp3';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private musicVolume: number = 0.45;
  private sfxVolume: number = 0.5;
  private isMusicPlaying: boolean = false;
  private bgAudio: HTMLAudioElement | null = null;

  constructor() {
    // AudioContext and HTMLAudioElement will be initialized on first user interaction
  }

  private initBgAudio(): HTMLAudioElement | null {
    if (typeof window === 'undefined') return null;
    if (!this.bgAudio) {
      try {
        this.bgAudio = new Audio(BGM_URL);
        this.bgAudio.loop = true;
        this.bgAudio.preload = 'auto';
        this.bgAudio.volume = this.isMuted ? 0 : this.musicVolume;
      } catch (err) {
        console.warn('Failed to initialize background audio:', err);
      }
    }
    return this.bgAudio;
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.bgAudio) {
      this.bgAudio.muted = muted;
      if (muted) {
        this.bgAudio.pause();
      } else if (this.isMusicPlaying) {
        this.bgAudio.play().catch(() => {});
      }
    }
  }

  public getMuted() {
    return this.isMuted;
  }

  public setSfxVolume(vol: number) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
  }

  public setMusicVolume(vol: number) {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    if (this.bgAudio) {
      this.bgAudio.volume = this.isMuted ? 0 : this.musicVolume;
    }
  }

  // --- SOUND EFFECTS ---

  // Red car horn: "¡BEEP!"
  public playHorn() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'square';
    
    // Two-tone car horn interval (e.g., F4 + A4)
    osc1.frequency.setValueAtTime(349.23, t);
    osc2.frequency.setValueAtTime(440.0, t);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.3 * this.sfxVolume, t + 0.02);
    gain.gain.setValueAtTime(0.3 * this.sfxVolume, t + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.3);
    osc2.stop(t + 0.3);
  }

  // Electric drill: "¡TRRR!"
  public playDrill() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const mod = this.ctx.createOscillator();
    const modGain = this.ctx.createGain();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    mod.type = 'square';

    mod.frequency.setValueAtTime(38, t); // Rapid buzz frequency
    modGain.gain.setValueAtTime(140, t);

    osc.frequency.setValueAtTime(180, t);
    osc.frequency.linearRampToValueAtTime(260, t + 0.25);

    mod.connect(modGain);
    modGain.connect(osc.frequency);

    gain.gain.setValueAtTime(0.25 * this.sfxVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    mod.start(t);
    osc.start(t);
    mod.stop(t + 0.32);
    osc.stop(t + 0.32);
  }

  // Alarm clock: "¡RING!"
  public playAlarm() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    // Ringing dual bell strike
    [0, 0.08, 0.16].forEach((offset) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1320, t + offset);
      osc.frequency.exponentialRampToValueAtTime(880, t + offset + 0.07);

      gain.gain.setValueAtTime(0.28 * this.sfxVolume, t + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.07);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(t + offset);
      osc.stop(t + offset + 0.08);
    });
  }

  // Megaphone / Loudspeaker: "¡ALTA!"
  public playMegaphone() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(620, t);
    osc.frequency.linearRampToValueAtTime(920, t + 0.12);
    osc.frequency.linearRampToValueAtTime(540, t + 0.25);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.3 * this.sfxVolume, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.3);
  }

  // Angry Cat: "¡MIAU!"
  public playCat() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    // Meow frequency curve: start mid, dip, shoot up high, then slide down
    osc.frequency.setValueAtTime(450, t);
    osc.frequency.exponentialRampToValueAtTime(320, t + 0.06);
    osc.frequency.exponentialRampToValueAtTime(950, t + 0.18);
    osc.frequency.exponentialRampToValueAtTime(400, t + 0.35);

    gain.gain.setValueAtTime(0.05 * this.sfxVolume, t);
    gain.gain.linearRampToValueAtTime(0.3 * this.sfxVolume, t + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.38);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.4);
  }

  // Siren: "¡WEE-WOO!"
  public playSiren() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(700, t);
    osc.frequency.linearRampToValueAtTime(950, t + 0.15);
    osc.frequency.linearRampToValueAtTime(650, t + 0.3);

    gain.gain.setValueAtTime(0.25 * this.sfxVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.32);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.35);
  }

  // Jackhammer: "¡DOK-DOK!"
  public playJackhammer() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    [0, 0.05, 0.1, 0.15].forEach((offset) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(90, t + offset);
      osc.frequency.exponentialRampToValueAtTime(30, t + offset + 0.04);

      gain.gain.setValueAtTime(0.35 * this.sfxVolume, t + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.045);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(t + offset);
      osc.stop(t + offset + 0.05);
    });
  }

  // Energy drink / Powerup pickup
  public playPowerup() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const notes = [440, 554.37, 659.25, 880, 1108.73]; // A major arpeggio
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, t + idx * 0.05);

      gain.gain.setValueAtTime(0.22 * this.sfxVolume, t + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.05 + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(t + idx * 0.05);
      osc.stop(t + idx * 0.05 + 0.12);
    });
  }

  // Jump sound
  public playJump() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.exponentialRampToValueAtTime(480, t + 0.14);

    gain.gain.setValueAtTime(0.2 * this.sfxVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.16);
  }

  // Slide / Dash sound
  public playSlide() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(90, t + 0.12);

    gain.gain.setValueAtTime(0.22 * this.sfxVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.13);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.14);
  }

  // Object hitting pavement
  public playPavementHit() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, t);
    osc.frequency.exponentialRampToValueAtTime(25, t + 0.09);

    gain.gain.setValueAtTime(0.25 * this.sfxVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.11);
  }

  // Player hurt / collision
  public playHurt() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.linearRampToValueAtTime(60, t + 0.2);

    gain.gain.setValueAtTime(0.4 * this.sfxVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.26);
  }

  // Near-miss / Dodged closely
  public playNearMiss() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(1400, t + 0.08);

    gain.gain.setValueAtTime(0.18 * this.sfxVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.1);
  }

  // Classic Mario Bros "¡YUJU!" style triumphant jump/level-up exclamation
  public playYujuLevelUp() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // Part 1: "YU-" (gliding up scoop)
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'square';
    osc1.frequency.setValueAtTime(392, t); // G4
    osc1.frequency.exponentialRampToValueAtTime(659.25, t + 0.1); // E5

    gain1.gain.setValueAtTime(0, t);
    gain1.gain.linearRampToValueAtTime(0.35 * this.sfxVolume, t + 0.02);
    gain1.gain.exponentialRampToValueAtTime(0.01, t + 0.11);

    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    osc1.start(t);
    osc1.stop(t + 0.12);

    // Part 2: "-HUUU!" (bright soaring peak with vibrato)
    const t2 = t + 0.11;
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(880, t2); // A5
    osc2.frequency.linearRampToValueAtTime(1046.5, t2 + 0.08); // C6
    osc2.frequency.exponentialRampToValueAtTime(1318.51, t2 + 0.22); // E6

    gain2.gain.setValueAtTime(0, t2);
    gain2.gain.linearRampToValueAtTime(0.4 * this.sfxVolume, t2 + 0.03);
    gain2.gain.setValueAtTime(0.4 * this.sfxVolume, t2 + 0.18);
    gain2.gain.exponentialRampToValueAtTime(0.001, t2 + 0.35);

    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    osc2.start(t2);
    osc2.stop(t2 + 0.36);

    // Triumphant fanfare chord behind it
    const fanfareNotes = [523.25, 659.25, 783.99, 1046.5];
    fanfareNotes.forEach((freq, idx) => {
      const fOsc = this.ctx!.createOscillator();
      const fGain = this.ctx!.createGain();
      fOsc.type = 'square';
      fOsc.frequency.setValueAtTime(freq, t2 + idx * 0.04);
      fGain.gain.setValueAtTime(0.2 * this.sfxVolume, t2 + idx * 0.04);
      fGain.gain.exponentialRampToValueAtTime(0.001, t2 + idx * 0.04 + 0.2);
      fOsc.connect(fGain);
      fGain.connect(this.ctx!.destination);
      fOsc.start(t2 + idx * 0.04);
      fOsc.stop(t2 + idx * 0.04 + 0.22);
    });
  }

  // Classic Arcade Coin pickup sound (B5 -> E6 ping)
  public playCoin() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(987.77, t); // B5
    osc.frequency.setValueAtTime(1318.51, t + 0.07); // E6

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.28 * this.sfxVolume, t + 0.01);
    gain.gain.setValueAtTime(0.28 * this.sfxVolume, t + 0.07);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.32);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.35);
  }

  // School Bell (School Map Hazard)
  public playSchoolBell() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    for (let i = 0; i < 5; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1500, t + i * 0.06);

      gain.gain.setValueAtTime(0.25 * this.sfxVolume, t + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.06 + 0.055);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + i * 0.06);
      osc.stop(t + i * 0.06 + 0.06);
    }
  }

  // Playground Ball bounce (Park Map Hazard)
  public playBallBounce() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, t);
    osc.frequency.exponentialRampToValueAtTime(75, t + 0.12);

    gain.gain.setValueAtTime(0.35 * this.sfxVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.13);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.14);
  }

  // Subway Speaker Chime (Subway Map Hazard)
  public playSubwayChime() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const notes = [587.33, 739.99, 880]; // D5, F#5, A5
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + idx * 0.1);
      gain.gain.setValueAtTime(0.24 * this.sfxVolume, t + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.1 + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(t + idx * 0.1);
      osc.stop(t + idx * 0.1 + 0.22);
    });
  }

  // Buy Shop Item Success
  public playBuy() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, t + idx * 0.05);
      gain.gain.setValueAtTime(0.2 * this.sfxVolume, t + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.05 + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(t + idx * 0.05);
      osc.stop(t + idx * 0.05 + 0.13);
    });
  }

  // --- NEW RETRO SOUNDS FOR GRADUAL NOISE LEVELS ---

  // Bird Chirp: "¡PÍO!" (Quiet Level 1)
  public playBird() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1800, t);
    osc.frequency.linearRampToValueAtTime(2600, t + 0.07);
    osc.frequency.linearRampToValueAtTime(2100, t + 0.14);
    gain.gain.setValueAtTime(0.12 * this.sfxVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.16);
  }

  // Leaf Blower: "¡FUUU!" (Moderate soft hum)
  public playLeafBlower() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.linearRampToValueAtTime(210, t + 0.2);
    gain.gain.setValueAtTime(0.15 * this.sfxVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.3);
  }

  // Rattle / Wooden branches: "¡CRAC!"
  public playRattle() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    [0, 0.04, 0.08].forEach((off) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, t + off);
      osc.frequency.exponentialRampToValueAtTime(150, t + off + 0.03);
      gain.gain.setValueAtTime(0.18 * this.sfxVolume, t + off);
      gain.gain.exponentialRampToValueAtTime(0.001, t + off + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(t + off);
      osc.stop(t + off + 0.05);
    });
  }

  // Lawnmower engine motor: "¡BRRRR!"
  public playLawnmower() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, t);
    osc.frequency.linearRampToValueAtTime(170, t + 0.25);
    gain.gain.setValueAtTime(0.26 * this.sfxVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.32);
  }

  // Mini Car rev & skid: "¡VROOOM!" (Loud vehicle hazard)
  public playSmallCar() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc1.type = 'sawtooth';
    osc2.type = 'square';
    osc1.frequency.setValueAtTime(95, t);
    osc1.frequency.linearRampToValueAtTime(260, t + 0.22);
    osc1.frequency.linearRampToValueAtTime(140, t + 0.35);
    osc2.frequency.setValueAtTime(190, t);
    osc2.frequency.linearRampToValueAtTime(520, t + 0.22);
    gain.gain.setValueAtTime(0.32 * this.sfxVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.38);
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);
    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.4);
    osc2.stop(t + 0.4);
  }

  // Motorcycle throttle: "¡BRAAP!"
  public playMotorcycle() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.linearRampToValueAtTime(380, t + 0.18);
    osc.frequency.exponentialRampToValueAtTime(90, t + 0.32);
    gain.gain.setValueAtTime(0.35 * this.sfxVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.34);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.35);
  }

  // Referee whistle: "¡FIIII!" (High-pitched piercing noise)
  public playWhistle() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const mod = this.ctx.createOscillator();
    const modGain = this.ctx.createGain();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    mod.type = 'sine';
    mod.frequency.setValueAtTime(32, t);
    modGain.gain.setValueAtTime(120, t);
    osc.frequency.setValueAtTime(2400, t);
    mod.connect(modGain);
    modGain.connect(osc.frequency);
    gain.gain.setValueAtTime(0.3 * this.sfxVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    mod.start(t);
    osc.start(t);
    mod.stop(t + 0.3);
    osc.stop(t + 0.3);
  }

  // Boombox Street Beat: "¡BASS!"
  public playBoombox() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.18);
    gain.gain.setValueAtTime(0.4 * this.sfxVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.26);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.28);
  }

  // Air Horn stadium blast: "¡HOOOONK!" (Extremely loud)
  public playAirHorn() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    [466.16, 587.33, 783.99].forEach((freq) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.35 * this.sfxVolume, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(t);
      osc.stop(t + 0.36);
    });
  }

  // Small Truck engine roar: "¡RUUUUMBLE!"
  public playTruck() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(75, t);
    osc.frequency.linearRampToValueAtTime(140, t + 0.2);
    osc.frequency.exponentialRampToValueAtTime(50, t + 0.4);
    gain.gain.setValueAtTime(0.42 * this.sfxVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.42);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.45);
  }

  // Thunder crash: "¡BOOOOM!"
  public playThunder() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(90, t);
    osc.frequency.exponentialRampToValueAtTime(25, t + 0.35);
    gain.gain.setValueAtTime(0.45 * this.sfxVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.48);
  }

  // Streak Multiplier level up (e.g. x2, x3, x5!)
  public playStreakUp() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + idx * 0.06);

      gain.gain.setValueAtTime(0.25 * this.sfxVolume, t + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.06 + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(t + idx * 0.06);
      osc.stop(t + idx * 0.06 + 0.16);
    });
  }

  // Game over sound
  public playGameOver() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const notes = [330, 311, 293, 277, 246]; // Melancholic retro descent
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t + idx * 0.14);

      gain.gain.setValueAtTime(0.28 * this.sfxVolume, t + idx * 0.14);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.14 + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(t + idx * 0.14);
      osc.stop(t + idx * 0.14 + 0.22);
    });
  }

  // Industrial Hydraulic Press (Fábrica Hazard: "¡KLANG!")
  public playHydraulicPress() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(35, t + 0.18);
    gain.gain.setValueAtTime(0.45 * this.sfxVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.24);
  }

  // Steam Release Valve (Fábrica Hazard: "¡PSSSH!")
  public playSteamPipe() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(900, t);
    osc.frequency.linearRampToValueAtTime(300, t + 0.3);
    gain.gain.setValueAtTime(0.25 * this.sfxVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.36);
  }

  // Workshop Circular Saw (Taller Hazard: "¡ZZZZ!")
  public playCircularSaw() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const mod = this.ctx.createOscillator();
    const modGain = this.ctx.createGain();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    mod.type = 'square';
    mod.frequency.setValueAtTime(55, t);
    modGain.gain.setValueAtTime(200, t);
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.linearRampToValueAtTime(580, t + 0.25);
    mod.connect(modGain);
    modGain.connect(osc.frequency);
    gain.gain.setValueAtTime(0.3 * this.sfxVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    mod.start(t);
    osc.start(t);
    mod.stop(t + 0.3);
    osc.stop(t + 0.3);
  }

  // Screeching Train Wheels (Metro Hazard: "¡SKREEECH!")
  public playTrainWheel() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1400, t);
    osc.frequency.linearRampToValueAtTime(2200, t + 0.12);
    osc.frequency.linearRampToValueAtTime(1200, t + 0.3);
    gain.gain.setValueAtTime(0.32 * this.sfxVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.32);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.34);
  }

  // Deafening Jet Turbine (Aeropuerto Hazard: "¡WHOOOOSH!")
  public playJetTurbine() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc1.type = 'sawtooth';
    osc2.type = 'sine';
    osc1.frequency.setValueAtTime(80, t);
    osc1.frequency.linearRampToValueAtTime(320, t + 0.3);
    osc2.frequency.setValueAtTime(800, t);
    osc2.frequency.linearRampToValueAtTime(1800, t + 0.3);
    gain.gain.setValueAtTime(0.38 * this.sfxVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);
    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.42);
    osc2.stop(t + 0.42);
  }

  // Blaring Rock Electric Guitar Riff (Concierto Hazard: "¡WAAAH!")
  public playRockGuitar() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc1.type = 'sawtooth';
    osc2.type = 'square';
    osc1.frequency.setValueAtTime(330, t);
    osc1.frequency.linearRampToValueAtTime(494, t + 0.15);
    osc2.frequency.setValueAtTime(332, t);
    osc2.frequency.linearRampToValueAtTime(498, t + 0.15);
    gain.gain.setValueAtTime(0.4 * this.sfxVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);
    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.38);
    osc2.stop(t + 0.38);
  }

  // Deep Cargo Ship Foghorn (Puerto Hazard: "¡BWOOOM!")
  public playFoghorn() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc1.type = 'sawtooth';
    osc2.type = 'triangle';
    osc1.frequency.setValueAtTime(82.4, t); // E2
    osc2.frequency.setValueAtTime(110.0, t); // A2
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.42 * this.sfxVolume, t + 0.05);
    gain.gain.setValueAtTime(0.42 * this.sfxVolume, t + 0.35);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);
    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.6);
    osc2.stop(t + 0.6);
  }

  // News Helicopter Rotor (Megaciudad Hazard: "¡CHOP-CHOP!")
  public playHelicopter() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    [0, 0.07, 0.14, 0.21].forEach((off) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(65, t + off);
      osc.frequency.exponentialRampToValueAtTime(25, t + off + 0.05);
      gain.gain.setValueAtTime(0.38 * this.sfxVolume, t + off);
      gain.gain.exponentialRampToValueAtTime(0.001, t + off + 0.06);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(t + off);
      osc.stop(t + off + 0.07);
    });
  }

  // Ultimate Victory Fanfare for beating all 10 Levels!
  public playVictoryTrophy() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    // Retro triumphant fanfare
    const notes = [
      { f: 523.25, d: 0.12 }, // C5
      { f: 659.25, d: 0.12 }, // E5
      { f: 783.99, d: 0.12 }, // G5
      { f: 1046.5, d: 0.25 }, // C6
      { f: 880.0, d: 0.15 },  // A5
      { f: 1046.5, d: 0.45 }, // C6 hold!
    ];
    let curTime = t;
    notes.forEach((n) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, curTime);
      gain.gain.setValueAtTime(0.32 * this.sfxVolume, curTime);
      gain.gain.exponentialRampToValueAtTime(0.001, curTime + n.d);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(curTime);
      osc.stop(curTime + n.d + 0.02);
      curTime += n.d * 0.9;
    });
  }

  // Squid Game Doll Chime / Luz Verde announcement ("Luz verde, luz roja...")
  public playSquidDollChime() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const melody = [
      { f: 523.25, d: 0.12 }, // C5
      { f: 587.33, d: 0.12 }, // D5
      { f: 659.25, d: 0.12 }, // E5
      { f: 523.25, d: 0.12 }, // C5
      { f: 659.25, d: 0.18 }, // E5
      { f: 783.99, d: 0.22 }, // G5
      { f: 659.25, d: 0.16 }, // E5
      { f: 523.25, d: 0.30 }, // C5
    ];
    let curTime = t;
    melody.forEach((n) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, curTime);
      gain.gain.setValueAtTime(0.28 * this.sfxVolume, curTime);
      gain.gain.exponentialRampToValueAtTime(0.001, curTime + n.d);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(curTime);
      osc.stop(curTime + n.d + 0.02);
      curTime += n.d * 0.95;
    });
  }

  // Sharp warning buzzer before Red Light activates
  public playRedLightWarning() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    [0, 0.14, 0.28].forEach((off) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(880, t + off);
      gain.gain.setValueAtTime(0.3 * this.sfxVolume, t + off);
      gain.gain.exponentialRampToValueAtTime(0.001, t + off + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(t + off);
      osc.stop(t + off + 0.11);
    });
  }

  // Intense Klaxon Siren when caught moving during Red Light
  public playCaughtAlarm() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    // Rapid alternating siren warbles
    for (let i = 0; i < 4; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      const startT = t + i * 0.22;
      osc.frequency.setValueAtTime(1100, startT);
      osc.frequency.linearRampToValueAtTime(600, startT + 0.1);
      osc.frequency.linearRampToValueAtTime(1100, startT + 0.2);
      gain.gain.setValueAtTime(0.42 * this.sfxVolume, startT);
      gain.gain.exponentialRampToValueAtTime(0.001, startT + 0.21);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startT);
      osc.stop(startT + 0.22);
    }
  }

  // --- ORIGINAL BACKGROUND MUSIC AUDIO PLAYBACK (PAC BABY - PAC-MAN CE 2) ---

  public startMusic(speedMultiplier: number = 1, forceRestart: boolean = false) {
    this.isMusicPlaying = true;
    if (this.isMuted) return;

    const audio = this.initBgAudio();
    if (!audio) return;

    audio.volume = this.musicVolume;
    audio.muted = false;

    // Dynamic playback rate to sync with game excitement
    try {
      audio.playbackRate = Math.max(0.75, Math.min(1.4, speedMultiplier));
    } catch {
      // ignore
    }

    if (forceRestart) {
      audio.currentTime = 0;
    }

    if (audio.paused) {
      const p = audio.play();
      if (p !== undefined) {
        p.catch((err) => {
          // Browsers require a user interaction to start audio
          console.log('BGM playback waiting for user interaction:', err);
        });
      }
    }
  }

  public stopMusic(reset: boolean = false) {
    this.isMusicPlaying = false;
    if (this.bgAudio) {
      this.bgAudio.pause();
      if (reset) {
        this.bgAudio.currentTime = 0;
      }
    }
  }

  public restartMusic(speedMultiplier: number = 1) {
    this.startMusic(speedMultiplier, true);
  }

  public isPlayingMusic() {
    return this.bgAudio ? !this.bgAudio.paused : false;
  }
}

export const sounds = new SoundEngine();
