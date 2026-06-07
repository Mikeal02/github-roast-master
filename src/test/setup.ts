import "@testing-library/jest-dom";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// jsdom lacks ResizeObserver / IntersectionObserver used by charts & animations.
class MockObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
// @ts-expect-error test shim
window.ResizeObserver = MockObserver;
// @ts-expect-error test shim
window.IntersectionObserver = MockObserver;
