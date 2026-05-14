"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";

import { mnProfile } from "@/lib/i18n/mn-profile";

const STORAGE_KEY = "mazaalai-profile-email-reminders";

export function NotificationsPreference() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw !== null) {
      setEnabled(raw === "1");
    }
  }, []);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
  };

  return (
    <section
      id="notifications"
      className="scroll-mt-24 rounded-2xl border-3 border-[#E8920A] bg-transparent p-4 shadow-[0_8px_24px_rgba(232,146,10,0.08)] md:p-5 dark:border-[#84d8ff]/40 dark:shadow-[0_8px_24px_rgba(132,216,255,0.12)]"
    >
      <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#8a806f]">
        {mnProfile.notificationsTitle}
      </h2>
      <p className="mb-4 text-sm text-[#706552]">
        {mnProfile.notificationsBody}
      </p>
      <button
        type="button"
        onClick={toggle}
        className="flex w-full max-w-md items-center justify-between rounded-2xl border-3 border-[#e8dcc4] bg-transparent px-4 py-3 text-left text-sm font-bold text-[#2a241e] transition hover:border-[#E8920A] dark:border-[#37464f] dark:text-[#e8e4dc] dark:hover:border-[#84d8ff]/50"
      >
        <span>{mnProfile.notificationsDaily}</span>
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border-3 px-3 py-1 text-xs font-bold ${
            enabled
              ? "border-emerald-500 bg-transparent text-emerald-800 dark:border-emerald-400 dark:text-emerald-300"
              : "border-neutral-400 bg-transparent text-neutral-600 dark:border-neutral-600 dark:text-neutral-400"
          }`}
        >
          <Bell aria-hidden className="size-3.5 shrink-0" />
          {enabled ? mnProfile.notificationsOn : mnProfile.notificationsOff}
        </span>
      </button>
    </section>
  );
}
