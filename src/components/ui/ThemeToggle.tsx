"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      className={cn(
        "p-2 rounded-lg transition-all flex items-center gap-2 text-xs font-medium",
        "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 shadow-xs",
        className
      )}
      title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
    >
      {theme === "light" ? (
        <>
          <Moon className="w-4 h-4 text-zinc-700" />
          {showLabel && <span>Dark Mode</span>}
        </>
      ) : (
        <>
          <Sun className="w-4 h-4 text-amber-400" />
          {showLabel && <span>Light Mode</span>}
        </>
      )}
    </button>
  );
}
