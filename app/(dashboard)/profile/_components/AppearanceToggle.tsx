"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { mnProfile } from "@/lib/i18n/mn-profile";
import { mnUi } from "@/lib/i18n/mn-ui";

const STORAGE_KEY = "mazaalai-profile-dark-preview";

export function AppearanceToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const root = document.documentElement;
    const initial = saved === "1" || root.classList.contains("dark");
    setDark(initial);
    root.classList.toggle("dark", initial);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
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
        {dark ? mnUi.switchToLight : mnUi.switchToDark}
      </Button>
    </section>
  );
}
