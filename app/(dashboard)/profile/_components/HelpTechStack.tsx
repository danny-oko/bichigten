"use client";

import { Badge } from "@/components/ui/badge";
import { TECH_STACK_GROUPS } from "@/lib/help-tech-stack";
import { mnProfile } from "@/lib/i18n/mn-profile";

export function HelpTechStack() {
  const titles = {
    engine: mnProfile.helpTechGroupEngine,
    ai: mnProfile.helpTechGroupAi,
    management: mnProfile.helpTechGroupManagement,
  } as const;

  return (
    <div className="min-w-0 space-y-5">
      <p className="text-xs leading-relaxed text-[#706552] dark:text-[#b8b0a4]">
        {mnProfile.helpTechStackIntro}
      </p>
      {TECH_STACK_GROUPS.map((group) => (
        <div key={group.id} className="min-w-0">
          <h4 className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#8a806f] dark:text-[#9ba3a7]">
            {titles[group.id]}
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {group.labels.map((label) => (
              <Badge
                key={label}
                variant="outline"
                className="border-[#ead9bb] bg-[#fffdf7]/40 font-normal text-[#4a4338] dark:border-[#475569] dark:bg-transparent dark:text-[#e2e8f0]"
              >
                {label}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
