import Link from "next/link";
import type { Reading } from "../types/reading";
import { ReadingBadge } from "./ReadingBadge";

const DIFFICULTY_LABELS: Record<Reading["difficulty"], string> = {
  EASY: "Хялбар",
  MEDIUM: "Дунд",
  HARD: "Ахисан",
};

type ReadingCardProps = {
  reading: Reading;
};

export const ReadingCard = ({ reading }: ReadingCardProps) => {
  return (
    <article className="flex min-h-64 flex-col rounded-2xl border-3 border-[#E8920A] bg-transparent p-5 shadow-[0_8px_24px_rgba(232,146,10,0.08)] transition hover:-translate-y-0.5 dark:border-[#84d8ff]/40">
      <div className="flex items-start justify-between gap-3">
        <ReadingBadge>{DIFFICULTY_LABELS[reading.difficulty]}</ReadingBadge>
        <span className="text-xs font-semibold text-stone-400">
          {reading.wordsCount} үг
        </span>
      </div>

      <div className="mt-5 flex-1">
        <h2 className="text-xl font-semibold text-stone-950">
          {reading.title}
        </h2>
        <p className="mt-3 text-sm leading-6 text-stone-600">
          {reading.description ?? "Минутын уншлагын богино эх"}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        {reading.requiredAccuracy ? (
          <p className="text-xs font-semibold text-amber-800">
            {reading.requiredAccuracy}% шаардлагатай
          </p>
        ) : (
          <span />
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
