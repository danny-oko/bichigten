"use client";

import { useEffect, useState } from "react";

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
      className="scroll-mt-24 rounded-3xl border border-[#ead9bb] bg-linear-to-br from-white via-[#fffefb] to-[#f8fafc] p-4 shadow-sm md:p-5"
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
        className="flex w-full max-w-md items-center justify-between rounded-2xl border border-[#e8dcc4] bg-linear-to-r from-[#fffefb] to-[#faf3e8] px-4 py-3 text-left text-sm font-bold text-[#2a241e] shadow-sm transition hover:border-[#E8920A]/30"
      >
        <span>{mnProfile.notificationsDaily}</span>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            enabled
              ? "bg-emerald-100 text-emerald-800"
              : "bg-neutral-200 text-neutral-600"
          }`}
        >
          {enabled ? mnProfile.notificationsOn : mnProfile.notificationsOff}
        </span>
      </button>
    </section>
  );
}
