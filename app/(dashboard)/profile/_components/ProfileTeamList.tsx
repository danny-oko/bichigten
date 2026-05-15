"use client";

import Image from "next/image";

import {
  HoverCard,
  HoverCardArrow,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { mnProfile } from "@/lib/i18n/mn-profile";
import {
  PROJECT_TEAM_MEMBERS,
  TEAM_FOCUS_LABELS,
} from "@/lib/project-team";

export function ProfileTeamList() {
  return (
    <ul className="space-y-2">
      {PROJECT_TEAM_MEMBERS.map((member) => (
        <li key={member.name}>
          <HoverCard openDelay={160} closeDelay={80}>
            <HoverCardTrigger
              href="#"
              onClick={(e) => {
                e.preventDefault();
              }}
              className="flex w-full cursor-default flex-col items-stretch gap-1 rounded-xl border border-[#ead9bb] bg-[#fffdf7]/50 px-3 py-2.5 text-left no-underline outline-none transition-colors hover:border-[#E8920A]/70 hover:bg-[#fffdf7] dark:border-[#37464f] dark:bg-transparent dark:hover:border-[#84d8ff]/40 dark:hover:bg-[#1e293b]/40"
            >
              <div className="flex w-full flex-col items-start gap-0.5">
                <span className="w-full text-left text-sm font-bold text-[#2a241e] dark:text-[#f0ebe3]">
                  {member.name}
                </span>
                <span className="w-full text-left text-xs font-medium text-[#a67c2e] dark:text-[#84d8ff]">
                  {member.membershipRole}
                </span>
              </div>
              {member.contribution ? (
                <p className="w-full text-left text-xs leading-relaxed text-[#5c5346] dark:text-[#c4bcb0]">
                  {member.contribution}
                </p>
              ) : (
                <p className="w-full text-left text-xs italic text-[#8a806f] dark:text-[#9ba3a7]">
                  {mnProfile.helpTeamNoContribution}
                </p>
              )}
            </HoverCardTrigger>
            <HoverCardContent
              side="top"
              className="w-[min(18rem,calc(100vw-2rem))] border-[#ead9bb] bg-[#fffdf8] p-0 text-left text-[#3b2f2f] shadow-xl dark:border-[#37464f] dark:bg-[#1e293b] dark:text-[#f0ebe3]"
            >
              <HoverCardArrow className="fill-[#fffdf8] dark:fill-[#1e293b]" />
              <div className="border-b border-[#ead9bb] px-3 pt-3 pb-2 dark:border-[#37464f]">
                <p className="font-bold leading-tight">{member.name}</p>
                <p className="mt-0.5 text-xs text-[#706552] dark:text-[#b8b0a4]">
                  {member.membershipRole}
                </p>
              </div>
              <div className="relative aspect-square w-full overflow-hidden bg-muted">
                <Image
                  src={member.imageUrl}
                  alt={member.name}
                  fill
                  sizes="288px"
                  className="object-cover"
                  priority={false}
                />
              </div>
              {member.focusAreas.length > 0 ? (
                <div className="p-3">
                  <div className="flex flex-wrap gap-1.5">
                    {member.focusAreas.map((key) => (
                      <span
                        key={key}
                        className="rounded-md border border-[#ead9bb] bg-[#fff8e7] px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-[#6b4d26] dark:border-[#475569] dark:bg-[#0f172a] dark:text-[#cbd5e1]"
                      >
                        {TEAM_FOCUS_LABELS[key]}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </HoverCardContent>
          </HoverCard>
        </li>
      ))}
    </ul>
  );
}
