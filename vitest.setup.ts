import "@testing-library/jest-dom";
import { vi } from "vitest";
import React from "react";

// The real "server-only" package throws when imported outside of Next's
// server webpack build — no-op it here so lib modules that guard themselves
// with `import "server-only"` can still be unit tested directly.
vi.mock("server-only", () => ({}));

if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = (query: string): MediaQueryList => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

if (typeof window !== "undefined") {
  const storage: Record<string, string> = {};
  Object.defineProperty(window, "localStorage", {
    configurable: true,
    value: {
      getItem(key: string) {
        return Object.prototype.hasOwnProperty.call(storage, key)
          ? storage[key]
          : null;
      },
      setItem(key: string, value: string) {
        storage[key] = String(value);
      },
      removeItem(key: string) {
        delete storage[key];
      },
      clear() {
        for (const key in storage) {
          delete storage[key];
        }
      },
      key(index: number) {
        return Object.keys(storage)[index] ?? null;
      },
      get length() {
        return Object.keys(storage).length;
      },
    } as Storage,
  });
}

if (typeof window !== "undefined" && !window.IntersectionObserver) {
  class MockIntersectionObserver {
    callback: IntersectionObserverCallback;
    constructor(callback: IntersectionObserverCallback) {
      this.callback = callback;
    }
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
    takeRecords = () => [];
  }
  window.IntersectionObserver =
    MockIntersectionObserver as unknown as typeof IntersectionObserver;
}

interface MockImageProps extends React.ComponentPropsWithoutRef<"img"> {
  priority?: boolean;
  placeholder?: string;
  unoptimized?: boolean;
}

vi.mock("next/image", () => ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- destructured only to strip Next-only props before spreading the rest onto a plain <img>.
  default: ({ alt, priority, placeholder, unoptimized, loading, ...rest }: MockImageProps) => {
    return React.createElement("img", { alt, ...rest });
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: vi.fn(() => "/"),
}));
