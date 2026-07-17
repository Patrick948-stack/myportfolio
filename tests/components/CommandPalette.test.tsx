import { describe, expect, it } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import CommandPalette, { fuzzyMatch } from "@/components/CommandPalette";
import { renderWithProviders } from "../test-utils";

describe("CommandPalette", () => {
  it("matches subsequence queries", () => {
    expect(fuzzyMatch("bl", "Blog")).toBe(true);
    expect(fuzzyMatch("bk", "Bookmark")).toBe(true);
    expect(fuzzyMatch("xz", "Blog")).toBe(false);
  });

  it("opens and filters actions", () => {
    renderWithProviders(<CommandPalette />);

    const openButton = screen.getByRole("button", { name: /open command menu/i });
    fireEvent.click(openButton);

    const input = screen.getByPlaceholderText(/Jump to a section or run a command/i);
    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "blog" } });
    expect(screen.getByText(/Go to Blog/i)).toBeInTheDocument();
  });
});
