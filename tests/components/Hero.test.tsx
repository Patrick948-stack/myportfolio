import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../test-utils";

// Scene3D dynamically imports "three" and drives real WebGL calls, which
// jsdom cannot provide (canvas.getContext("webgl") returns null there).
// Stub just enough of the API surface for Scene3D's effect to run without
// throwing — this is a rendering integration the drills/manual QA cover,
// not something worth reproducing a real WebGL context for in a unit test.
vi.mock("three", () => {
  class Disposable {
    dispose = vi.fn();
  }
  class Scene {
    add = vi.fn();
  }
  class PerspectiveCamera {
    aspect = 1;
    position = { z: 0 };
    updateProjectionMatrix = vi.fn();
  }
  class WebGLRenderer {
    domElement = document.createElement("canvas");
    setSize = vi.fn();
    setPixelRatio = vi.fn();
    render = vi.fn();
    dispose = vi.fn();
  }
  class Group {
    rotation = { x: 0, y: 0 };
    add = vi.fn();
  }
  class Mesh {
    geometry: Disposable;
    material: Disposable;
    constructor(geometry: Disposable, material: Disposable) {
      this.geometry = geometry;
      this.material = material;
    }
  }
  class BufferGeometry extends Disposable {
    setAttribute = vi.fn();
  }
  class Points {
    material: Disposable;
    constructor(_geometry: unknown, material: Disposable) {
      this.material = material;
    }
  }

  return {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Group,
    Mesh,
    IcosahedronGeometry: Disposable,
    MeshBasicMaterial: Disposable,
    BufferGeometry,
    BufferAttribute: class {},
    Points,
    PointsMaterial: Disposable,
  };
});

import Hero from "@/components/Hero";
import type { HeroContent } from "@/types";

const content: HeroContent = {
  titles: ["Software Engineer"],
  headline: "Exploring the boundaries of his creativity with technology.",
  subtitle: "Hi, I'm Patrick.",
};

describe("Hero", () => {
  it("renders the headline and both call-to-action links", () => {
    renderWithProviders(<Hero content={content} />);
    expect(
      screen.getByText(/exploring the boundaries of his creativity/i)
    ).toBeInTheDocument();

    const resumeCta = screen.getByRole("link", { name: /View My Resume/i });
    expect(resumeCta).toHaveAttribute("href", "/my-cv.pdf");

    const servicesCta = screen.getByRole("link", { name: /My Services/i });
    expect(servicesCta).toHaveAttribute("href", "#services");
  });
});
