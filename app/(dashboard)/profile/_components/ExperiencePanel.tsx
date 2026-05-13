import { mnProfile } from "@/lib/i18n/mn-profile";

import { ExperienceInfo } from "../common/types";

type ExperiencePanelProps = {
  experience: ExperienceInfo;
};

export default function ExperiencePanel({ experience }: ExperiencePanelProps) {
  const percent = Math.max(
    0,
    Math.min(100, (experience.currentXp / experience.nextLevelXp) * 100),
  );

  return (
    <section className="rounded-2xl border-3 border-[#E8920A] bg-transparent p-4 shadow-[0_8px_24px_rgba(232,146,10,0.08)] dark:border-[#84d8ff]/40 dark:shadow-[0_8px_24px_rgba(132,216,255,0.12)]">
      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#8a806f] dark:text-[#9ba3a7]">
        {mnProfile.experienceTitle}
      </p>
      <p className="mt-2 text-2xl font-extrabold tabular-nums text-[#1f1c18] dark:text-[#f0ebe3] sm:text-3xl md:text-4xl">
        {experience.currentXp.toLocaleString()}
        <span className="ml-1 text-base font-bold text-[#4a8ec5] sm:text-lg">XP</span>
      </p>
      <p className="text-sm font-semibold text-[#7c7263] dark:text-[#a8a095]">
        {mnProfile.experienceLevel(experience.currentLevel)}
      </p>
      <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#e8e0d1] dark:bg-[#37464f]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#7eb8ea] via-[#4a8ec5] to-[#1C2B4A]"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="mt-1 flex justify-between text-xs font-semibold text-[#8a806f] dark:text-[#9ba3a7]">
        <span>{experience.currentXp.toLocaleString()}</span>
        <span>{experience.nextLevelXp.toLocaleString()}</span>
      </div>
    </section>
  );
}
