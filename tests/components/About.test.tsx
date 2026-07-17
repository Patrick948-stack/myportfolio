import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../test-utils";
import { screen } from "@testing-library/react";
import About from "@/components/About";
import type { AboutContent } from "@/types";

const content: AboutContent = {
  photo: "/images/user.png",
  bio: ["Paragraph one.", "Paragraph two."],
  skills: [{ category: "Languages", iconKey: "code", items: ["Python"] }],
  experiences: [
    { period: "2025", role: "Engineer", org: "Acme", description: "Did things." },
  ],
  educations: [
    { year: "2028", institution: "Whitman", location: "WA", degree: "BA" },
  ],
};

describe("About", () => {
  it("renders About section with tabs", () => {
    renderWithProviders(<About content={content} />);
    expect(screen.getByText(/About Me/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /skills/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /experience/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /education/i })).toBeInTheDocument();
  });
});
