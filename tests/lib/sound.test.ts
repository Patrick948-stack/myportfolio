import { beforeEach, describe, expect, it, vi } from "vitest";
import { playClickSound, playHoverSound, playSuccessSound } from "@/lib/sound";

const oscillatorMock = {
  frequency: {
    setValueAtTime: vi.fn(),
    exponentialRampToValueAtTime: vi.fn(),
  },
  connect: vi.fn(),
  start: vi.fn(),
  stop: vi.fn(),
};

const gainMock = {
  gain: {
    setValueAtTime: vi.fn(),
    linearRampToValueAtTime: vi.fn(),
    exponentialRampToValueAtTime: vi.fn(),
  },
  connect: vi.fn(),
};

const audioCtxMock = {
  state: "running",
  currentTime: 0,
  resume: vi.fn(function () {}),
  createOscillator: vi.fn(function () {
    return oscillatorMock;
  }),
  createGain: vi.fn(function () {
    return gainMock;
  }),
  destination: {},
};

describe("sound utility", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "AudioContext",
      vi.fn(function () {
        return audioCtxMock;
      }) as unknown as typeof AudioContext,
    );
    audioCtxMock.state = "running";
    audioCtxMock.resume.mockClear();
    audioCtxMock.createOscillator.mockClear();
    audioCtxMock.createGain.mockClear();
    oscillatorMock.frequency.setValueAtTime.mockClear();
    oscillatorMock.frequency.exponentialRampToValueAtTime.mockClear();
    oscillatorMock.connect.mockClear();
    oscillatorMock.start.mockClear();
    oscillatorMock.stop.mockClear();
    gainMock.gain.setValueAtTime.mockClear();
    gainMock.gain.linearRampToValueAtTime.mockClear();
    gainMock.gain.exponentialRampToValueAtTime.mockClear();
    gainMock.connect.mockClear();
  });

  it("plays hover sound without throwing", () => {
    expect(() => playHoverSound()).not.toThrow();
    expect(audioCtxMock.createOscillator).toHaveBeenCalled();
    expect(oscillatorMock.start).toHaveBeenCalled();
    expect(oscillatorMock.stop).toHaveBeenCalled();
  });

  it("resumes a suspended context before playing", () => {
    audioCtxMock.state = "suspended";
    expect(() => playClickSound()).not.toThrow();
    expect(audioCtxMock.resume).toHaveBeenCalled();
  });

  it("plays success sound and schedules a glide", () => {
    expect(() => playSuccessSound()).not.toThrow();
    expect(audioCtxMock.createOscillator).toHaveBeenCalled();
    expect(oscillatorMock.frequency.exponentialRampToValueAtTime).toHaveBeenCalled();
  });
});
