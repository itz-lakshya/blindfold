"use client";

import { useEffect, useState } from "react";

export type Theme = "default" | "sage" | "onyx" | "dark";

const THEME_KEY = "blindfold_theme";

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>("default");

  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY) as Theme;
    if (saved) {
      setTheme(saved);
      document.documentElement.className = saved === "default" ? "" : `theme-${saved}`;
    }
  }, []);

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
    document.documentElement.className = newTheme === "default" ? "" : `theme-${newTheme}`;
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-muted uppercase tracking-widest font-mono">Theme</span>
      <div className="flex gap-2">
        <button
          onClick={() => changeTheme("default")}
          className={`w-4 h-4 rounded-full border border-border bg-[#f4f0e8] transition-transform ${theme === "default" ? "ring-2 ring-primary ring-offset-2 ring-offset-bg scale-110" : "hover:scale-110"}`}
          title="Warm Parchment"
          aria-label="Warm theme"
        />
        <button
          onClick={() => changeTheme("sage")}
          className={`w-4 h-4 rounded-full border border-border bg-[#C8CAC5] transition-transform ${theme === "sage" ? "ring-2 ring-primary ring-offset-2 ring-offset-bg scale-110" : "hover:scale-110"}`}
          title="Muted Sage"
          aria-label="Sage theme"
        />
        <button
          onClick={() => changeTheme("onyx")}
          className={`w-4 h-4 rounded-full border border-border bg-[#000000] transition-transform ${theme === "onyx" ? "ring-2 ring-primary ring-offset-2 ring-offset-bg scale-110" : "hover:scale-110"}`}
          title="Onyx (Pitch Black)"
          aria-label="Onyx theme"
        />
        <button
          onClick={() => changeTheme("dark")}
          className={`w-4 h-4 rounded-full border border-border bg-[#151815] transition-transform ${theme === "dark" ? "ring-2 ring-primary ring-offset-2 ring-offset-bg scale-110" : "hover:scale-110"}`}
          title="Dark (Olive)"
          aria-label="Dark theme"
        />
      </div>
    </div>
  );
}
