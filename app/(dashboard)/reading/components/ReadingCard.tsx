import Link from "next/link";
import { memo } from "react";
import { cn } from "@/lib/utils";
import type { ReadingCardData } from "../types/reading";

const DIFFICULTY_LABELS: Record<ReadingCardData["difficulty"], string> = {
  EASY: "Хялбар",
  MEDIUM: "Дунд",
  HARD: "Ахисан",
};

const difficultyStyles: Record<ReadingCardData["difficulty"], string> = {
  EASY: "border-green-300 bg-green-50 text-green-700",
  MEDIUM: "border-amber-300 bg-amber-50 text-amber-700",
  HARD: "border-red-300 bg-red-50 text-red-700",
};

type ReadingCardProps = {
  reading: ReadingCardData;
};

const formatPercent = (value: number | undefined) => `${value ?? 0}%`;

const clampPercent = (value: number | undefined) =>
  Math.min(100, Math.max(0, value ?? 0));

const ProgressRow = ({
  label,
  value,
}: {
  label: string;
  value: number | undefined;
}) => (
  <div>
    <div className="flex items-center justify-between gap-3 text-xs font-semibold">
      <span className="text-stone-600">{label}</span>
      <span className="tabular-nums text-stone-950">
        {formatPercent(value)}
      </span>
    </div>
    <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#f3dfbd]">
      <div
        className="h-full rounded-full bg-[#E8920A] transition-all duration-500"
        style={{ width: `${clampPercent(value)}%` }}
      />
    </div>
  </div>
);

const ReadingCardComponent = ({ reading }: ReadingCardProps) => {
  const hasAttempt = Boolean(reading.latestAttempt);
  const latestAccuracy = reading.latestAttempt?.accuracy;
  const bestAccuracy = reading.bestAttempt?.accuracy;
  const statusLabel = hasAttempt
    ? reading.completed
      ? "Давсан"
      : "Дахин оролдох"
    : "Эхлээгүй";
  const xpLabel = hasAttempt ? `${reading.xpEarned ?? 0} XP` : "0 XP";

  return (
    <article className="flex min-h-56 flex-col rounded-2xl border-3 border-[#E8920A] bg-[#fff8ec] p-4 shadow-[0_10px_28px_rgba(232,146,10,0.1)] transition hover:-translate-y-0.5 md:min-h-64 md:p-5 dark:border-[#84d8ff]/40">
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            "w-fit rounded-full border-3 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]",
            difficultyStyles[reading.difficulty],
          )}
        >
          {DIFFICULTY_LABELS[reading.difficulty]}
        </span>
        <span className="text-xs font-semibold text-stone-400">
          {reading.wordsCount} үг
        </span>
      </div>

      <div className="mt-4 flex-1 md:mt-5">
        <h2 className="text-lg font-semibold text-stone-950 md:text-xl">
          {reading.title}
        </h2>
        <p className="mt-3 text-sm leading-6 text-stone-600">
          {reading.description ?? "Минутын уншлагын богино эх"}
        </p>
      </div>

      <section className="mt-4 rounded-2xl border-2 border-[#E8920A]/20 bg-[#fffaf2] p-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-xs font-semibold text-amber-800">Таны ахиц</h3>
          {!hasAttempt && (
            <span className="text-xs font-semibold text-stone-500">
              Одоогоор уншаагүй
            </span>
          )}
        </div>

        <div className="mt-3 space-y-3">
          <ProgressRow label="Өмнөх дүн" value={latestAccuracy} />
          <ProgressRow label="Дээд амжилт" value={bestAccuracy} />
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <span
            className={`rounded-full border-2 px-3 py-1 text-xs font-semibold ${
              reading.completed
                ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                : hasAttempt
                  ? "border-orange-300 bg-orange-50 text-orange-800"
                  : "border-amber-200 bg-[#fff3dc] text-amber-800"
            }`}
          >
            {statusLabel}
          </span>
          <span className="rounded-full border-2 border-[#E8920A]/25 bg-[#fff3dc] px-3 py-1 text-xs font-semibold text-amber-900">
            Авсан XP: {xpLabel}
          </span>
        </div>
      </section>

      <div className="mt-5 flex items-center justify-between gap-3 md:mt-6 md:gap-4">
        {reading.requiredAccuracy ? (
          <p className="text-xs font-semibold text-amber-800">
            {reading.requiredAccuracy}% шаардлагатай · {reading.xpReward} XP
          </p>
        ) : (
          <p className="text-xs font-semibold text-amber-800">
            {reading.xpReward} XP
          </p>
        )}
        <Link
          href={`/reading/${reading.id}`}
          className="rounded-full bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700"
        >
          Унших
        </Link>
      </div>
    </article>
  );
};

export const ReadingCard = memo(ReadingCardComponent);
