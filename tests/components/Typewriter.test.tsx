import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import Typewriter from "@/components/Typewriter";

async function stepMs(ms: number) {
  await act(() => vi.advanceTimersByTimeAsync(ms));
}

describe("Typewriter", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("types out the first word character by character", async () => {
    render(<Typewriter words={["Hi"]} typingSpeed={10} />);

    await stepMs(10);
    expect(screen.getByText("H", { exact: false })).toBeInTheDocument();

    await stepMs(10);
    expect(screen.getByText("Hi", { exact: false })).toBeInTheDocument();
  });

  it("deletes the word and moves to the next one after the pause", async () => {
    render(
      <Typewriter
        words={["Hi", "Yo"]}
        typingSpeed={10}
        deletingSpeed={10}
        pauseDuration={50}
      />
    );

    // Type both characters of "Hi", one step per character
    await stepMs(10);
    await stepMs(10);
    expect(screen.getByText("Hi", { exact: false })).toBeInTheDocument();

    // Wait out the pause before deletion starts
    await stepMs(50);

    // Delete both characters, one step per character
    await stepMs(10);
    await stepMs(10);

    // Type both characters of the next word, "Yo"
    await stepMs(10);
    await stepMs(10);
    expect(screen.getByText("Yo", { exact: false })).toBeInTheDocument();
  });
});
