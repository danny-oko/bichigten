import { mnProfile } from "@/lib/i18n/mn-profile";

import { JourneyProgress } from "../common/types";

type CurrentJourneyPanelProps = {
  journey: JourneyProgress;
};

export default function CurrentJourneyPanel({
  journey,
}: CurrentJourneyPanelProps) {
  return (
    <section className="rounded-2xl border-3 border-[#E8920A] bg-transparent p-4 shadow-[0_8px_24px_rgba(232,146,10,0.08)] dark:border-[#84d8ff]/40 dark:shadow-[0_8px_24px_rgba(132,216,255,0.12)] md:p-5">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <span className="rounded-full border-3 border-[#E8920A] bg-transparent px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#6b4d26] dark:border-[#84d8ff]/50 dark:text-[#e8c98a]">
          {journey.moduleLabel}
        </span>
        <span className="text-sm font-bold text-[#7e7463]">
          {journey.lessonProgressText}
        </span>
      </div>
      <h2 className="wrap-break-word text-xl font-extrabold tracking-tight text-[#27221d] dark:text-[#f0ebe3] sm:text-2xl md:text-3xl">
        {journey.title}
      </h2>
      <p className="mt-1 wrap-break-word text-sm text-[#756c5e] dark:text-[#a8a095]">
        {journey.description}
      </p>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#e9e2d5]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#f5c96a] via-[#E8920A] to-[#c9780a]"
          style={{ width: `${journey.completionPercent}%` }}
        />
      </div>
      <div className="mt-1 flex justify-between text-sm font-semibold text-[#6e6556]">
        <span>{journey.lessonsLeftText}</span>
        <span>{journey.completionPercent}%</span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-2xl border-3 border-dashed border-[#e5d4b8] bg-transparent p-3 dark:border-[#4a5560]">
          <p className="text-xs font-bold uppercase tracking-wider text-[#8a806f]">
            {mnProfile.journeyLearnCharacters}
          </p>
          <p className="mt-1 text-lg font-bold text-[#27221d]">
            {journey.characterProgressText}
          </p>
        </div>
        <div className="rounded-2xl border-3 border-dashed border-[#e5d4b8] bg-transparent p-3 dark:border-[#4a5560]">
          <p className="text-xs font-bold uppercase tracking-wider text-[#8a806f]">
            {mnProfile.journeyPracticeTime}
          </p>
          <p className="mt-1 text-lg font-bold text-[#27221d]">
            {journey.practiceProgressText}
          </p>
        </div>
      </div>
    </section>
  );
}
