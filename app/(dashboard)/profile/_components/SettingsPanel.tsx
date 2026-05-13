"use client";

import Link from "next/link";
import { useClerk } from "@clerk/nextjs";

import { mnProfile } from "@/lib/i18n/mn-profile";

import type { ProfileSettingItem } from "../common/types";

type SettingsPanelProps = {
  settings: ProfileSettingItem[];
};

const sectionHref: Record<string, string> = {
  account: "/profile?tab=settings#account",
  appearance: "/profile?tab=settings#appearance",
  notifications: "/profile?tab=settings#notifications",
  help: "/profile?tab=settings#help",
};

export default function SettingsPanel({ settings }: SettingsPanelProps) {
  const { signOut } = useClerk();

  const onLogout = async () => {
    await signOut({ redirectUrl: "/sign-in" });
  };

  return (
    <section className="rounded-2xl border-3 border-[#E8920A] bg-transparent p-4 shadow-[0_8px_24px_rgba(232,146,10,0.08)] dark:border-[#84d8ff]/40 dark:shadow-[0_8px_24px_rgba(132,216,255,0.12)]">
      <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#8a806f] dark:text-[#9ba3a7]">
        {mnProfile.settingsSectionTitle}
      </h2>
      <div className="space-y-2.5">
        {settings.map((item) => {
          const href = sectionHref[item.id] ?? "/profile?tab=settings";
          return (
            <Link
              key={item.id}
              href={href}
              scroll={true}
              className="group flex w-full items-center gap-3 rounded-2xl border-3 border-[#ead9bb] bg-transparent px-3 py-3 text-left transition-colors hover:border-[#E8920A] dark:border-[#37464f] dark:hover:border-[#84d8ff]/50"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border-3 border-[#E8920A] bg-transparent text-sm dark:border-[#84d8ff]/40">
                {item.icon}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-[#2a241e] dark:text-[#f0ebe3]">
                  {item.label}
                </span>
                <span className="block truncate text-xs text-[#7d7364] dark:text-[#9ba3a7]">
                  {item.description}
                </span>
              </span>
              <span className="text-lg text-[#c4a574] group-hover:text-[#E8920A]">
                ›
              </span>
            </Link>
          );
        })}
        <button
          type="button"
          onClick={onLogout}
          className="mt-2 w-full rounded-2xl border-3 border-[#f0c4c4] bg-transparent px-3 py-2.5 text-sm font-bold text-[#cc5d5d] transition-colors hover:border-[#cc5d5d] dark:border-[#7f1d1d]/60 dark:text-[#f87171]"
        >
          {mnProfile.logOut}
        </button>
      </div>
    </section>
  );
}
