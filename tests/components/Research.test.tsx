import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../test-utils";
import Research from "@/components/Research";
import { papers } from "@/data/research";

describe("Research", () => {
  it("renders a card for every research paper", () => {
    renderWithProviders(<Research />);
    expect(screen.getByText(/Research & Writing/i)).toBeInTheDocument();
    papers.forEach((paper) => {
      expect(screen.getByText(paper.title)).toBeInTheDocument();
    });
    expect(screen.getAllByText(/Read Paper/i).length).toBe(papers.length);
  });
});
