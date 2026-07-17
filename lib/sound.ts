let ctx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    ctx = new AudioContext();
  }
  if (ctx.state === "suspended") {
    void ctx.resume();
  }
  return ctx;
}

interface ToneOptions {
  frequency: number;
  duration: number;
  type?: OscillatorType;
  volume?: number;
  glideTo?: number;
}

function playTone({ frequency, duration, type = "sine", volume = 0.08, glideTo }: ToneOptions) {
  const audioCtx = getContext();
  if (!audioCtx) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const now = audioCtx.currentTime;

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, now);
  if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, now + duration);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume, now + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(now);
  osc.stop(now + duration);
}

export function playHoverSound() {
  playTone({ frequency: 880, duration: 0.06, type: "sine", volume: 0.045 });
}

export function playClickSound() {
  playTone({ frequency: 220, duration: 0.09, type: "triangle", volume: 0.09, glideTo: 440 });
}

export function playSuccessSound() {
  playTone({ frequency: 523.25, duration: 0.14, type: "sine", volume: 0.08, glideTo: 783.99 });
}
