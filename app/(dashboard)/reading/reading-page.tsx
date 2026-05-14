"use client";

import { useEffect, useState } from "react";
import { DifficultyTabs } from "./components/DifficultyTabs";
import { ReadingGrid, ReadingGridSkeleton } from "./components/ReadingGrid";
import { ReadingHeader } from "./components/ReadingHeader";
import { SearchBar } from "./components/SearchBar";
import { useReadingFilter } from "./hooks/useReadingFilter";
import type { ReadingCardData } from "./types/reading";

export const ReadingPage = () => {
  const { difficulty, query, searchParams, setDifficulty, setQuery } =
    useReadingFilter();
  const [readings, setReadings] = useState<ReadingCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const loadReadings = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const url = searchParams
          ? `/api/reading?${searchParams}`
          : "/api/reading";
        const res = await fetch(url, { signal: controller.signal });

        if (!res.ok) {
          throw new Error(`Failed to load readings: ${res.status}`);
        }

        const data = (await res.json()) as ReadingCardData[];
        setReadings(data);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(
          err instanceof Error ? err.message : "Failed to load readings",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadReadings();

    return () => {
      controller.abort();
    };
  }, [searchParams]);

  return (
    <main className="min-h-screen w-full overflow-x-hidden px-4 pt-5 pb-[calc(7rem+env(safe-area-inset-bottom))] text-stone-900 md:pb-8 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 md:gap-6">
        <ReadingHeader
          title="Минутын уншлага"
          description="Унших эхээ сонгоод 60 секундын дотор уламжлалт бичгээ чангаар уншаарай."
        />

        <div className="grid w-full gap-3 md:gap-4 lg:grid-cols-[minmax(280px,420px)_1fr] lg:items-center">
          <SearchBar value={query} onChange={setQuery} />
          <div className="min-w-0 lg:justify-self-end">
            <DifficultyTabs value={difficulty} onChange={setDifficulty} />
          </div>
        </div>

        {error && (
          <section className="rounded-2xl border-3 border-red-300 bg-transparent p-4 text-sm font-medium text-red-700 dark:border-red-500/50 dark:text-red-300">
            {error}
          </section>
        )}

        {isLoading ? (
          <ReadingGridSkeleton />
        ) : (
          <ReadingGrid readings={readings} />
        )}
      </div>
    </main>
  );
};
