import { afterEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../test-utils";

const newPlot = vi.fn();
const purge = vi.fn();

vi.mock("plotly.js-dist-min", () => ({
  default: { newPlot, purge },
}));

import DataVizShowcase from "@/components/DataVizShowcase";

describe("DataVizShowcase", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    newPlot.mockClear();
    purge.mockClear();
  });

  it("shows a loading skeleton before the elevation data resolves", () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise(() => {})) // never resolves
    );
    renderWithProviders(<DataVizShowcase />);
    expect(screen.getByText(/Loading elevation data/i)).toBeInTheDocument();
  });

  it("renders the section heading and description", () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({ json: () => Promise.resolve({ z: [[1, 2], [3, 4]] }) })
      )
    );
    renderWithProviders(<DataVizShowcase />);
    expect(screen.getByText(/Featured Visualization/i)).toBeInTheDocument();
  });
});
