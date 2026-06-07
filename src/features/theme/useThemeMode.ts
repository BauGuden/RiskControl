import { useEffect, useState } from "react";
import { applyThemeMode, getStoredThemeMode, saveThemeMode, type ThemeMode } from "./theme";

export function useThemeMode() {
  const [themeMode, setThemeMode] = useState<ThemeMode>(getStoredThemeMode);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const syncTheme = () => applyThemeMode(themeMode);

    syncTheme();
    saveThemeMode(themeMode);

    if (themeMode !== "system") return undefined;

    media.addEventListener("change", syncTheme);
    return () => media.removeEventListener("change", syncTheme);
  }, [themeMode]);

  return { themeMode, setThemeMode };
}
