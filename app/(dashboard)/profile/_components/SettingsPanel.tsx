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
    <section className="rounded-3xl border border-[#ead9bb] bg-gradient-to-b from-white to-[#fffdf6] p-4 shadow-sm">
      <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#8a806f]">
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
              className="group flex w-full items-center gap-3 rounded-2xl border border-[#efe0cc] bg-gradient-to-r from-[#fffefb] to-[#faf3e8] px-3 py-3 text-left shadow-sm transition-colors hover:border-[#E8920A]/35 hover:bg-[#faf6ee]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fde9b8] to-[#f0c978] text-sm ring-1 ring-white/60">
                {item.icon}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-[#2a241e]">
                  {item.label}
                </span>
                <span className="block truncate text-xs text-[#7d7364]">
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
<<<<<<< HEAD
          className="mt-2 w-full rounded-2xl border border-[#f0c4c4] bg-gradient-to-r from-[#fff8f8] to-[#ffecec] px-3 py-2.5 text-sm font-bold text-[#cc5d5d] transition-colors hover:bg-[#fff0f0]"
=======
          className="mt-2 w-full rounded-xl border border-[#f0d3d3] bg-[#fff7f7] px-3 py-2 text-sm font-semibold text-[#cc5d5d] hover:bg-[#ffecec]"
>>>>>>> cd84c80 (Revert "Theme & Loading Screen")
        >
          {mnProfile.logOut}
        </button>
      </div>
    </section>
  );
}
