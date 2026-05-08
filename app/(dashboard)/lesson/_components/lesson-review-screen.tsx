"use client";

import { useEffect, useState } from "react";
import { LessonReviewStats } from "./lesson-review-types";
import { Star, Target } from "lucide-react";

function AnimatedNumber({
  target,
  duration = 1200,
}: {
  target: number;
  duration?: number;
}) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setValue(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return <>{value}</>;
}

export function LessonReviewScreen({
  stats,
  onContinue,
}: {
  stats: LessonReviewStats;
  onContinue: () => void;
}) {
  const { xpEarned, totalQuestions, correctAnswers } = stats;
  const accuracy =
    totalQuestions > 0
      ? Math.round((correctAnswers / totalQuestions) * 100)
      : 100;
  const accuracyLabel =
    accuracy === 100 ? "AMAZING" : accuracy >= 80 ? "GREAT" : "NICE";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 font-['Plus_Jakarta_Sans']">
      <div className="w-full max-w-2xl flex flex-col items-center gap-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="rounded-full bg-white p-5 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
            <Star className="h-14 w-14 text-[#F4C400] fill-[#F4C400]" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#F4C400] leading-none">
            Lesson Complete!
          </h1>
        </div>

        <div className="w-full flex flex-col items-center justify-center gap-8">
          <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="h-25 w-70 rounded-[24px] border-[3px] border-[#F4C400] bg-white overflow-hidden">
              <div className="bg-[#F4C400] py-1 text-center text-xs font-black tracking-wide text-white">
                XP EARNED
              </div>
              <div className="flex items-center justify-center gap-2 py-3">
                <Star className="h-7 w-7 text-[#F4C400] fill-[#F4C400]" />
                <span className="text-3xl font-black text-[#F4C400] leading-none">
                  <AnimatedNumber target={xpEarned} />
                </span>
              </div>
            </div>

            <div className="h-25 w-70 rounded-[24px] border-[3px] border-[#58CC02] bg-white overflow-hidden">
              <div className="bg-[#58CC02] py-1 text-center text-xs font-black tracking-wide text-white">
                {accuracyLabel}
              </div>
              <div className="flex items-center justify-center gap-2 py-3">
                <Target className="h-7 w-7 text-[#58CC02]" />
                <span className="text-3xl font-black text-[#58CC02] leading-none">
                  <AnimatedNumber target={accuracy} />%
                </span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onContinue}
          className="w-full max-w-sm py-4 rounded-2xl font-black text-base tracking-widest uppercase text-white active:scale-95 transition-all"
          style={{ background: "#E8920A", boxShadow: "0 4px 10px #E8920A" }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
