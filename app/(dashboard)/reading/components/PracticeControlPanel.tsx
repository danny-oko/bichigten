"use client";

import { Button } from "@/components/ui/button";

import type { ReadingStatus } from "../types/reading";

type PracticeControlPanelProps = {
  canStart: boolean;
  className?: string;
  durationSec: number;
  elapsedSeconds: number;
  isRecording: boolean;
  requiredAccuracy: number | null;
  secondsLeft: number;
  status: ReadingStatus;
  wordsCount: number;
  xpReward: number;
  onStart: () => void;
  onStop: () => void;
};

const getPanelTitle = (status: ReadingStatus) => {
  if (status === "recording" || status === "transcribing") {
    return "Уншиж байна...";
  }

  if (status === "done") {
    return "Дууссан";
  }

  return "Бэлэн үү?";
};

const getButtonText = (status: ReadingStatus) => {
  if (status === "recording" || status === "transcribing") {
    return "Уншиж байна...";
  }

  if (status === "done") {
    return "Дахин унших";
  }

  return "Эхлэх";
};

const StatCard = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-2xl border-2 border-[#E8920A]/25 bg-[#fffaf2] p-4 dark:border-[#475569]/60 dark:bg-[#0f172a]/50">
    <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-[#fcd34d]">
      {label}
    </p>
    <p className="mt-1 text-lg font-semibold text-stone-950 dark:text-[#f0ebe3]">
      {value}
    </p>
  </div>
);

export const PracticeControlPanel = ({
  canStart,
  className,
  durationSec,
  elapsedSeconds,
  isRecording,
  requiredAccuracy,
  secondsLeft,
  status,
  wordsCount,
  xpReward,
  onStart,
  onStop,
}: PracticeControlPanelProps) => {
  const progress = Math.min(100, (elapsedSeconds / durationSec) * 100);

  return (
    <section
      className={`w-full rounded-2xl border-3 border-[#E8920A] bg-[#fff8ec] p-4 shadow-[0_14px_36px_rgba(232,146,10,0.12)] md:p-5 dark:border-[#84d8ff]/40 dark:bg-[#1e293b]/70 dark:shadow-[0_14px_36px_rgba(0,0,0,0.35)] ${className ?? ""}`}
    >
      <div className="rounded-2xl border-2 border-[#E8920A]/20 bg-[#fffaf2] p-4 md:p-5 dark:border-[#475569]/60 dark:bg-[#0f172a]/50">
        <p className="text-sm font-semibold text-amber-800 dark:text-[#fcd34d]">
          Уншлагын дасгал
        </p>
        <h2 className="mt-1.5 text-xl font-semibold text-stone-950 md:mt-2 md:text-2xl dark:text-[#f0ebe3]">
          {getPanelTitle(status)}
        </h2>
        <p className="mt-2 text-sm leading-5 text-stone-600 md:min-h-10 md:leading-6 dark:text-[#b8b0a4]">
          {status === "idle" || status === "error"
            ? "Эхлэх дарсны дараа эх тодорч, 60 секундийн тоолуур эхэлнэ."
            : status === "done"
              ? "Дүнгээ хараад дахин уншиж оноогоо ахиулж болно."
              : "Тогтуун хэмнэлээр, тод дуудаж уншаарай."}
        </p>
      </div>

      <div className="mt-5 flex justify-center md:mt-6">
        <div
          className="grid size-36 place-items-center rounded-full p-2.5 shadow-inner transition-all duration-700 ease-out [--ring-fill:#E8920A] [--ring-track:#F8E5C4] dark:shadow-[inset_0_2px_20px_rgba(0,0,0,0.35)] dark:[--ring-fill:#38bdf8] dark:[--ring-track:#1e293b] md:size-44 md:p-3"
          style={{
            background: `conic-gradient(var(--ring-fill) ${progress}%, var(--ring-track) ${progress}% 100%)`,
          }}
          aria-label={`${secondsLeft} seconds left`}
        >
          <div className="grid size-full place-items-center rounded-full border-2 border-[#E8920A]/20 bg-[#fffaf2] dark:border-[#475569]/60 dark:bg-[#0f172a]/80">
            <div className="text-center">
              <p className="text-5xl font-semibold tabular-nums text-stone-950 md:text-6xl dark:text-[#f0ebe3]">
                {secondsLeft}
              </p>
              <p className="mt-1 text-sm font-semibold text-amber-800 dark:text-[#fcd34d]">
                секунд
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-3 md:mt-6">
        <Button
          type="button"
          onClick={onStart}
          disabled={!canStart}
          className="h-12 w-full rounded-full bg-amber-600 px-6 text-base font-semibold text-white shadow-[0_10px_24px_rgba(217,119,6,0.22)] transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-stone-300 disabled:text-stone-500 disabled:shadow-none dark:bg-[#0ea5e9] dark:shadow-[0_10px_24px_rgba(14,165,233,0.25)] dark:hover:bg-sky-400 dark:disabled:bg-slate-700 dark:disabled:text-slate-400"
        >
          {getButtonText(status)}
        </Button>

        {isRecording && (
          <Button
            type="button"
            onClick={onStop}
            variant="outline"
            className="h-11 w-full rounded-full border-2 border-stone-300 bg-transparent text-sm font-semibold text-stone-800 transition hover:border-[#E8920A] hover:text-amber-800 dark:border-[#475569] dark:text-[#e8e4dc] dark:hover:border-[#84d8ff] dark:hover:text-[#e0f2fe]"
          >
            Болчихлоо!
          </Button>
        )}
      </div>

      <div className="mt-4 hidden gap-3 md:grid md:grid-cols-3 lg:grid-cols-1">
        <StatCard label="Онооны босго" value={`${requiredAccuracy ?? 0}%`} />
        <StatCard label="Урамшуулал оноо" value={`${xpReward} XP`} />
        <StatCard label="Нийт үг" value={`${wordsCount}`} />
      </div>
    </section>
  );
};
