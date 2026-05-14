import { useMemo } from "react";
import type { ReadingCardData } from "../types/reading";
import { ReadingCard } from "./ReadingCard";

type ReadingGridProps = {
  readings: ReadingCardData[];
};

const difficultyLabels: Record<string, string> = {
  EASY: "Хялбар",
  MEDIUM: "Дунд",
  HARD: "Ахисан",
};

const difficultyLabels: Record<string, string> = {
  EASY: "Хялбар",
  MEDIUM: "Дунд",
  HARD: "Ахисан",
};

export const ReadingGrid = ({ readings }: ReadingGridProps) => {
  const groupedReadings = useMemo(
    () => ({
      EASY: readings.filter((reading) => reading.difficulty === "EASY"),
      MEDIUM: readings.filter((reading) => reading.difficulty === "MEDIUM"),
      HARD: readings.filter((reading) => reading.difficulty === "HARD"),
    }),
    [readings],
  );

  return (
    <div className="flex w-full flex-col gap-7 md:gap-10">
      {Object.entries(groupedReadings).map(([difficulty, items]) => {
        if (!items.length) return null;

        return (
          <section key={difficulty} className="flex flex-col gap-4 md:gap-5">
            <div className="flex items-center gap-3 md:gap-4">
              <h2 className="text-xl font-black text-[#2A2118] md:text-2xl">
                {difficultyLabels[difficulty]}
              </h2>

              <div className="h-px flex-1 bg-[#D9C7A3]" />
            </div>

            <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-3">
              {items.map((reading) => (
                <ReadingCard key={reading.id} reading={reading} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};

const ReadingCardSkeleton = () => (
  <article className="flex min-h-56 animate-pulse flex-col rounded-2xl border-3 border-[#E8920A]/70 bg-[#fff8ec] p-4 shadow-[0_10px_28px_rgba(232,146,10,0.08)] md:min-h-64 md:p-5 dark:border-[#84d8ff]/40">
    <div className="flex items-start justify-between gap-3">
      <div className="h-7 w-24 rounded-full bg-amber-200/70" />
      <div className="h-4 w-12 rounded-full bg-amber-100" />
    </div>
    <div className="mt-5 space-y-3">
      <div className="h-6 w-3/4 rounded-full bg-amber-200/70" />
      <div className="h-4 w-full rounded-full bg-amber-100" />
      <div className="h-4 w-5/6 rounded-full bg-amber-100" />
    </div>
    <div className="mt-5 rounded-2xl border-2 border-[#E8920A]/15 bg-[#fffaf2] p-3">
      <div className="h-4 w-24 rounded-full bg-amber-200/70" />
      <div className="mt-4 space-y-4">
        <div className="h-2 rounded-full bg-amber-100" />
        <div className="h-2 rounded-full bg-amber-100" />
      </div>
      <div className="mt-4 flex gap-2">
        <div className="h-7 w-24 rounded-full bg-amber-100" />
        <div className="h-7 w-28 rounded-full bg-amber-100" />
      </div>
    </div>
    <div className="mt-auto flex items-center justify-between gap-3 pt-5">
      <div className="h-4 w-28 rounded-full bg-amber-100" />
      <div className="h-10 w-20 rounded-full bg-amber-200/70" />
    </div>
  </article>
);

export const ReadingGridSkeleton = () => {
  const sections = ["EASY", "MEDIUM", "HARD"];

  return (
    <div className="flex w-full flex-col gap-7 md:gap-10">
      {sections.map((difficulty) => (
        <section key={difficulty} className="flex flex-col gap-4 md:gap-5">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="h-7 w-24 animate-pulse rounded-full bg-amber-200/70" />
            <div className="h-px flex-1 bg-[#D9C7A3]" />
          </div>

          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <ReadingCardSkeleton key={`${difficulty}-${index}`} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};
