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
    <section className="rounded-3xl border border-[#ead9bb] bg-gradient-to-br from-white via-[#f8fbff] to-[#eef4fc] p-4 shadow-sm">
      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#8a806f]">
        {mnProfile.experienceTitle}
      </p>
      <p className="mt-2 text-4xl font-extrabold tabular-nums text-[#1f1c18]">
        {experience.currentXp.toLocaleString()}
        <span className="ml-1 text-lg font-bold text-[#4a8ec5]">XP</span>
      </p>
      <p className="text-sm font-semibold text-[#7c7263]">
        {mnProfile.experienceLevel(experience.currentLevel)}
      </p>
      <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#e8e0d1]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#7eb8ea] via-[#4a8ec5] to-[#1C2B4A]"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="mt-1 flex justify-between text-xs font-semibold text-[#8a806f]">
        <span>{experience.currentXp.toLocaleString()}</span>
        <span>{experience.nextLevelXp.toLocaleString()}</span>
      </div>
    </section>
  );
}
