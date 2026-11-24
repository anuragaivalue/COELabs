"use client";

import React from "react";
import { useTheme } from "@/lib/theme-context";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }) {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <button
        aria-label="Toggle theme"
        className={cn(
          "relative inline-flex h-9 items-center gap-2 rounded-full px-3.5 text-xs font-semibold shadow-sm transition-all duration-200",
          "bg-neutral-900 text-white border border-neutral-800",
          className
        )}
      >
        <Moon className="size-3.5 text-white" />
        <span className="font-display tracking-tight"></span>
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={`Switch to ${isDark ? "white" : "dark"} theme`}
      className={cn(
        "group relative inline-flex h-9 items-center gap-2 rounded-full px-3.5 text-xs font-semibold shadow-md transition-all duration-200 cursor-pointer",
        // When theme is dark -> button is opposite: solid WHITE with black text in white accent
        isDark && "bg-white text-black border border-white hover:bg-neutral-100 ring-2 ring-white/30",
        // When theme is white/light -> button is opposite: solid DARK with white text in dark accent
        !isDark && "bg-neutral-900 text-white border border-neutral-800 hover:bg-black ring-2 ring-neutral-900/20",
        className
      )}
    >
      <div className="relative flex items-center justify-center">
        {isDark ? (
          <Sun className="size-3.5 text-amber-500 transition-transform group-hover:rotate-45" />
        ) : (
          <Moon className="size-3.5 text-orange-300 transition-transform group-hover:-rotate-12" />
        )}
      </div>
      {/* <span className="font-display tracking-tight">
        {isDark ? "White" : "Dark"}
      </span> */}
    </button>
  );
}
