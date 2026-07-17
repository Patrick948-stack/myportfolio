import { ReactElement } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { SoundProvider } from "@/components/SoundProvider";

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) {
  return render(<SoundProvider>{ui}</SoundProvider>, options);
}
