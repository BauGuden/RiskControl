import { beforeEach, describe, expect, it, vi } from "vitest";
import { applyThemeMode } from "./theme";

function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    }))
  });
}

describe("theme mode", () => {
  beforeEach(() => {
    document.documentElement.className = "";
    document.documentElement.removeAttribute("data-theme");
    document.documentElement.removeAttribute("style");
    mockMatchMedia(false);
  });

  it("applies dark mode", () => {
    applyThemeMode("dark");

    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(document.documentElement.style.colorScheme).toBe("dark");
  });

  it("forces light mode after dark mode", () => {
    applyThemeMode("dark");
    applyThemeMode("light");

    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(document.documentElement.style.colorScheme).toBe("light");
  });

  it("resolves system mode from prefers-color-scheme", () => {
    mockMatchMedia(true);

    applyThemeMode("system");

    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(document.documentElement.dataset.theme).toBe("dark");
  });
});
