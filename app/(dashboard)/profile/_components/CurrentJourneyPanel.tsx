import { mnProfile } from "@/lib/i18n/mn-profile";

import { JourneyProgress } from "../common/types";

type CurrentJourneyPanelProps = {
  journey: JourneyProgress;
};

export default function CurrentJourneyPanel({
  journey,
}: CurrentJourneyPanelProps) {
  return (
    <section className="rounded-3xl border border-[#ead9bb] bg-gradient-to-br from-white via-[#fffefb] to-[#fff2dc] p-4 shadow-sm md:p-5">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <span className="rounded-full bg-gradient-to-r from-[#fde9b8] to-[#f5d48a] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#6b4d26] shadow-sm ring-1 ring-[#f0c96a]/60">
          {journey.moduleLabel}
        </span>
        <span className="text-sm font-bold text-[#7e7463]">
          {journey.lessonProgressText}
        </span>
      </div>
      <h2 className="text-3xl font-extrabold tracking-tight text-[#27221d]">
        {journey.title}
      </h2>
      <p className="mt-1 text-sm text-[#756c5e]">{journey.description}</p>
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
        <div className="rounded-2xl border border-dashed border-[#e5d4b8] bg-[#fffaf3]/90 p-3">
          <p className="text-xs font-bold uppercase tracking-wider text-[#8a806f]">
            {mnProfile.journeyLearnCharacters}
          </p>
          <p className="mt-1 text-lg font-bold text-[#27221d]">
            {journey.characterProgressText}
          </p>
        </div>
        <div className="rounded-2xl border border-dashed border-[#e5d4b8] bg-[#fffaf3]/90 p-3">
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
