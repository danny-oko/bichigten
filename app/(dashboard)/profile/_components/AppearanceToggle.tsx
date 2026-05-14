"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { mnProfile } from "@/lib/i18n/mn-profile";
import { mnUi } from "@/lib/i18n/mn-ui";
import { THEME_STORAGE_KEY } from "@/lib/theme-storage";

export function AppearanceToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === "1") {
        setDark(true);
      } else if (saved === "0") {
        setDark(false);
      } else {
        setDark(document.documentElement.classList.contains("dark"));
      }
    } catch {
      setDark(document.documentElement.classList.contains("dark"));
    }
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next ? "1" : "0");
    } catch {
      /* private mode etc. */
    }
  };

  return (
    <section
      id="appearance"
      className="scroll-mt-24 rounded-2xl border-3 border-[#E8920A] bg-transparent p-4 shadow-[0_8px_24px_rgba(232,146,10,0.08)] md:p-5 dark:border-[#84d8ff]/40 dark:shadow-[0_8px_24px_rgba(132,216,255,0.12)]"
    >
      <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#8a806f]">
        {mnProfile.appearanceTitle}
      </h2>
      <p className="mb-4 text-sm text-[#706552]">{mnProfile.appearanceBody}</p>
      <Button
        type="button"
        variant="outline"
        onClick={toggle}
        className="rounded-2xl border-[#E8920A]/40 font-bold"
      >
        <span
          className="inline-flex items-center gap-2"
          suppressHydrationWarning
        >
          {dark ? (
            <Sun
              aria-hidden
              className="size-4 shrink-0 text-[#E8920A]"
            />
          ) : (
            <Moon
              aria-hidden
              className="size-4 shrink-0 text-[#5b6a78] dark:text-[#84d8ff]"
            />
          )}
          {dark ? mnUi.switchToLight : mnUi.switchToDark}
        </span>
      </Button>
    </section>
  );
}
