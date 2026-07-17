import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../test-utils";
import { screen } from "@testing-library/react";
import Navbar from "@/components/Navbar";

describe("Navbar", () => {
  it("renders navigation links", () => {
    renderWithProviders(<Navbar />);
    expect(screen.getAllByText(/Home/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Blog/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Contact/i).length).toBeGreaterThanOrEqual(1);
  });
});
