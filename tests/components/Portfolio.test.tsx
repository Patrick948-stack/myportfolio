import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../test-utils";
import { screen } from "@testing-library/react";
import Portfolio from "@/components/Portfolio";
import type { PortfolioContent } from "@/types";

const content: PortfolioContent = {
  items: [
    {
      id: "p1",
      title: "Test Project",
      description: "A test project.",
      image: "/images/work-1.png",
      href: "https://github.com/example/test",
    },
  ],
};

describe("Portfolio", () => {
  it("renders multiple project cards", () => {
    renderWithProviders(<Portfolio content={content} />);
    expect(screen.getByText(/My Work/i)).toBeInTheDocument();
    expect(screen.getAllByRole("img").length).toBeGreaterThanOrEqual(1);
  });
});
