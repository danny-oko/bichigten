import Image from "next/image";

import { mnProfile } from "@/lib/i18n/mn-profile";

type ProfileHeroProps = {
  name: string;
  username: string;
  memberSince: string;
  avatarUrl: string | null;
  avatarInitial: string;
  rankTitle: string;
  language: string;
};

export default function ProfileHero({
  name,
  username,
  memberSince,
  avatarUrl,
  avatarInitial,
  rankTitle,
  language,
}: ProfileHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl border-3 border-[#E8920A] bg-transparent shadow-[0_8px_24px_rgba(232,146,10,0.08)] dark:border-[#84d8ff]/40 dark:shadow-[0_8px_24px_rgba(132,216,255,0.12)]">
      <div className="relative px-5 pb-5 pt-5 md:px-8 md:pt-6">
        <div className="flex min-w-0 flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex min-w-0 items-start gap-3 sm:gap-4">
            <div className="flex h-18 w-18 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-[#fde9c4] bg-gradient-to-br from-[#f0a31a] to-[#d9780a] text-2xl font-bold text-white ring-2 ring-white/90 sm:h-20 sm:w-20 sm:text-3xl md:h-22 md:w-22">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={name}
                  width={80}
                  height={80}
                  className="size-full object-cover"
                  unoptimized
                />
              ) : (
                avatarInitial
              )}
            </div>
            <div className="min-w-0 flex-1 pt-2">
              <h1 className="wrap-break-word text-xl font-extrabold leading-tight text-[#1f1c18] dark:text-[#f0ebe3] sm:text-2xl md:text-3xl">
                {name}
              </h1>
              <p className="mt-0.5 wrap-break-word text-xs text-[#706552] dark:text-[#a8a095] sm:text-sm">
                {mnProfile.heroAt(username, memberSince)}
              </p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold md:hidden">
                <span className="-rotate-1 rounded-full border border-[#e7dbc2] bg-transparent px-3 py-1 text-[#8a6a2d] dark:border-[#4a4335] dark:text-[#e8c98a]">
                  {rankTitle}
                </span>
                <span className="rotate-1 rounded-full border border-[#d3def3] bg-transparent px-3 py-1 text-[#1C2B4A] dark:border-[#3d4f6a] dark:text-[#b8d4ff]">
                  {language}
                </span>
              </div>
            </div>
          </div>
          <div className="hidden flex-wrap gap-2 pt-2 text-xs font-semibold md:flex">
            <span className="-rotate-1 rounded-full border border-[#e7dbc2] bg-transparent px-3 py-1 text-[#8a6a2d] dark:border-[#4a4335] dark:text-[#e8c98a]">
              {rankTitle}
            </span>
            <span className="rotate-1 rounded-full border border-[#d3def3] bg-transparent px-3 py-1 text-[#1C2B4A] dark:border-[#3d4f6a] dark:text-[#b8d4ff]">
              {language}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
