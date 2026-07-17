import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SoundProvider, useSound } from "@/components/SoundProvider";

// toggle() plays a click sound via lib/sound.ts, which needs a real
// AudioContext; jsdom doesn't implement the Web Audio API, so stub just
// enough of it here (mirrors the fuller mock in tests/lib/sound.test.ts,
// which actually asserts on oscillator/gain call behavior).
vi.stubGlobal(
  "AudioContext",
  vi.fn(function () {
    return {
      state: "running",
      currentTime: 0,
      resume: vi.fn(),
      createOscillator: vi.fn(function () {
        return {
          frequency: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
          connect: vi.fn(),
          start: vi.fn(),
          stop: vi.fn(),
        };
      }),
      createGain: vi.fn(function () {
        return {
          gain: {
            setValueAtTime: vi.fn(),
            linearRampToValueAtTime: vi.fn(),
            exponentialRampToValueAtTime: vi.fn(),
          },
          connect: vi.fn(),
        };
      }),
      destination: {},
    };
  }) as unknown as typeof AudioContext
);

function ToggleProbe() {
  const { enabled, toggle } = useSound();
  return (
    <button onClick={toggle}>{enabled ? "sound on" : "sound off"}</button>
  );
}

describe("SoundProvider", () => {
  it("defaults to disabled and persists the toggle to localStorage", async () => {
    const user = userEvent.setup();
    localStorage.clear();

    render(
      <SoundProvider>
        <ToggleProbe />
      </SoundProvider>
    );

    const button = await screen.findByRole("button");
    expect(button).toHaveTextContent("sound off");

    await user.click(button);
    expect(button).toHaveTextContent("sound on");
    expect(localStorage.getItem("sound-enabled")).toBe("true");

    await user.click(button);
    expect(button).toHaveTextContent("sound off");
    expect(localStorage.getItem("sound-enabled")).toBe("false");
  });

  it("throws a clear error when useSound is called outside a provider", () => {
    function Bare() {
      useSound();
      return null;
    }
    expect(() => render(<Bare />)).toThrow(
      "useSound must be used within SoundProvider"
    );
  });
});
