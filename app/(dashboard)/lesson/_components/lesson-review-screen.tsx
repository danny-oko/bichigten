"use client";

import { Heart, Star, Target, Timer } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { mnUi } from "@/lib/i18n/mn-ui";
import { cn } from "@/lib/utils";

import { LessonReviewStats } from "./lesson-review-types";

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

function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

const ctaClass =
  "w-full rounded-2xl py-3.5 font-black uppercase tracking-widest sm:max-w-sm";

export function LessonReviewScreen({
  stats,
  onContinue,
}: {
  stats: LessonReviewStats;
  onContinue: () => void;
}) {
  const {
    xpEarned,
    totalQuestions,
    correctAnswers,
    heartsRemaining,
    timeSeconds,
  } = stats;
  const accuracy =
    totalQuestions > 0
      ? Math.round((correctAnswers / totalQuestions) * 100)
      : 100;

  const tier = accuracy === 100 ? "peak" : accuracy >= 80 ? "strong" : "steady";
  const tierLabel =
    tier === "peak" ? "Гайхалтай" : tier === "strong" ? "Сайн" : "Сайн байна";

  return (
    <div className="flex min-h-screen flex-col bg-transparent px-4 py-10  sm:px-6 sm:py-14">
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center">
        <div
          className={cn(
            "relative w-full overflow-hidden rounded-3xl border-[3px] border-[#E8920A] ",
            "shadow-[0_20px_50px_rgba(122,89,48,0.12)]",
            "dark:border-[#84d8ff]/35  dark:shadow-[0_24px_60px_rgba(0,0,0,0.35)]",
          )}
        >
          <div
            className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-transparent blur-2xl "
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-12 -left-10 h-40 w-40 rounded-full bg-[#E8920A]/15 blur-2xl dark:bg-[#84d8ff]/8"
            aria-hidden
          />

          <div className="relative flex flex-col items-center gap-8 px-6 py-10 sm:gap-10 sm:px-10 sm:py-12">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="space-y-2">
                <p className="font-balsamiq text-xs font-black uppercase tracking-[0.2em] text-[#b0892c] dark:text-[#94a3b8]">
                  Хичээл дууссан
                </p>
                <h1 className="font-balsamiq text-3xl font-black leading-tight text-[#2a2319] dark:text-[#fef3c7] sm:text-4xl">
                  {tierLabel}
                </h1>
                <p className="font-balsamiq text-sm text-[#5c4a2e]/90 dark:text-[#cbd5e1]">
                  {correctAnswers}/{totalQuestions} зөв ·{" "}
                  <span className="font-bold text-[#523403] dark:text-[#fde68a]">
                    {accuracy}%
                  </span>{" "}
                  нарийвчлал
                </p>
              </div>
            </div>

            <div className="grid w-full grid-cols-2 gap-3 sm:gap-4">
              <div
                className={cn(
                  "flex flex-col gap-2 rounded-2xl border-3 border-[#E8920A]/70  p-4 text-center",
                  "dark:border-[#84d8ff]/25 ",
                )}
              >
                <div className="flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#523403]/80 dark:text-[#94a3b8]">
                  <Star className="h-3.5 w-3.5 fill-[#E8920A] text-[#E8920A] dark:fill-[#fde68a] dark:text-[#fde68a]" />
                  XP
                </div>
                <p className="font-balsamiq text-3xl font-black tabular-nums text-[#523403] dark:text-[#fef3c7]">
                  +<AnimatedNumber target={xpEarned} />
                </p>
              </div>

              <div
                className={cn(
                  "flex flex-col gap-2 rounded-2xl border-2 border-[#15803d]/50  p-4 text-center",
                  "dark:border-emerald-500/30 ",
                )}
              >
                <div className="flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-900/70 dark:text-emerald-300/80">
                  <Target className="h-3.5 w-3.5" strokeWidth={2.5} />
                  Нарийвчлал
                </div>
                <p className="font-balsamiq text-3xl font-black tabular-nums text-emerald-900 dark:text-emerald-200">
                  <AnimatedNumber target={accuracy} />%
                </p>
              </div>
            </div>

            

            <Button
              type="button"
              variant="sortbutton"
              size="sort"
              onClick={onContinue}
              className={cn(
                ctaClass,
                "border-[#523403] bg-[#E8920A] text-[#1a1206] shadow-[0_4px_0_#523403] hover:brightness-105 active:translate-y-px active:shadow-[0_2px_0_#523403]",
                "dark:border-[#84d8ff] dark:bg-[#84d8ff]/20 dark:text-white dark:shadow-[0_4px_0_#1e3a47]",
              )}
            >
              {mnUi.continue}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
