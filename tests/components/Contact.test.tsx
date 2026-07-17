import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../test-utils";
import { screen } from "@testing-library/react";
import Contact from "@/components/Contact";
import type { ContactContent } from "@/types";

const content: ContactContent = {
  email: "patrickmulikuza948@gmail.com",
  phone: "+1 509 360 4942",
  social: [{ label: "linkedin", href: "https://www.linkedin.com/in/mulikuzap/" }],
};

describe("Contact", () => {
  it("renders contact section with email and submit button", () => {
    renderWithProviders(<Contact content={content} />);
    expect(screen.getByText(/patrickmulikuza948@gmail.com/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });
});
