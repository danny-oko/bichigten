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
    <section className="relative overflow-hidden rounded-3xl border border-[#ead9bb] bg-gradient-to-br from-white via-[#fffdf8] to-[#fff4e4] shadow-sm">
      <div className="relative px-5 pb-5 pt-5 md:px-8 md:pt-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-[#fde9c4] bg-gradient-to-br from-[#f0a31a] to-[#d9780a] text-3xl font-bold text-white ring-2 ring-white/90 md:h-22 md:w-22">
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
            <div className="pt-2">
              <h1 className="text-2xl font-extrabold leading-tight text-[#1f1c18] md:text-3xl">
                {name}
              </h1>
              <p className="text-sm text-[#706552]">
                {mnProfile.heroAt(username, memberSince)}
              </p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold md:hidden">
                <span className="-rotate-1 rounded-full border border-[#e7dbc2] bg-[#fff9ed] px-3 py-1 text-[#8a6a2d] shadow-sm">
                  {rankTitle}
                </span>
                <span className="rotate-1 rounded-full border border-[#d3def3] bg-[#ebf2ff] px-3 py-1 text-[#1C2B4A] shadow-sm">
                  {language}
                </span>
              </div>
            </div>
          </div>
          <div className="hidden flex-wrap gap-2 pt-2 text-xs font-semibold md:flex">
            <span className="-rotate-1 rounded-full border border-[#e7dbc2] bg-[#fff9ed] px-3 py-1 text-[#8a6a2d] shadow-sm">
              {rankTitle}
            </span>
            <span className="rotate-1 rounded-full border border-[#d3def3] bg-[#ebf2ff] px-3 py-1 text-[#1C2B4A] shadow-sm">
              {language}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
