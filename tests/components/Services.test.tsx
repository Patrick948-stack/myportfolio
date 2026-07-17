import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../test-utils";
import Services from "@/components/Services";
import type { ServicesContent } from "@/types";

const content: ServicesContent = {
  items: [
    {
      iconKey: "flask",
      title: "Research",
      description: "Research description.",
      ctaLabel: "Read more of my writing",
      ctaHref: "/blog",
    },
    {
      iconKey: "code",
      title: "App Development",
      description: "App dev description.",
      ctaLabel: "Let's connect",
      ctaHref: "#contact",
    },
    {
      iconKey: "microchip",
      title: "Embedded Systems",
      description: "Embedded description.",
      ctaLabel: "Let's connect",
      ctaHref: "#contact",
    },
  ],
};

describe("Services", () => {
  it("renders the services heading and all three service titles", () => {
    renderWithProviders(<Services content={content} />);
    expect(screen.getByText(/My Services/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /^Research$/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /App Development/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Embedded Systems/i })).toBeInTheDocument();
  });

  it("links each service's call-to-action to the right place", () => {
    renderWithProviders(<Services content={content} />);
    expect(
      screen.getByRole("link", { name: /Read more of my writing/i })
    ).toHaveAttribute("href", "/blog");
    expect(
      screen.getAllByRole("link", { name: /Let's connect/i })[0]
    ).toHaveAttribute("href", "#contact");
  });
});
