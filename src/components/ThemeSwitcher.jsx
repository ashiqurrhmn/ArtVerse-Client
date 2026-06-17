"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 focus:outline-none"
      style={{ backgroundColor: isDark ? "#546B41" : "#99AD7A" }}
      aria-label="Toggle dark mode"
    >
      <span
        className={`inline-flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md transform transition-transform duration-300 ${
          isDark ? "translate-x-9" : "translate-x-1"
        }`}
      >
        {isDark ? (
          <Moon size={14} className="text-[#546B41]" />
        ) : (
          <Sun size={14} className="text-[#99AD7A]" />
        )}
      </span>
    </button>
  );
}
