"use client";

import { useEffect, useState } from "react";
import { DifficultyTabs, ReadingGrid, ReadingHeader, SearchBar } from "./components";
import { useReadingFilter } from "./hooks/useReadingFilter";
import type { Reading } from "./types/reading";

export const ReadingPage = () => {
  const { difficulty, query, searchParams, setDifficulty, setQuery } =
    useReadingFilter();
  const [readings, setReadings] = useState<Reading[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const loadReadings = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const url = searchParams ? `/api/reading?${searchParams}` : "/api/reading";
        const res = await fetch(url, { signal: controller.signal });

        if (!res.ok) {
          throw new Error(`Failed to load readings: ${res.status}`);
        }

        const data = (await res.json()) as Reading[];
        setReadings(data);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Failed to load readings");
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
    <main className="min-h-screen w-full overflow-x-hidden bg-transparent px-6 py-6 text-stone-900 lg:px-10">
      <div className="flex w-full flex-col gap-6">
        <ReadingHeader
          title="Минутын уншлага"
          description="Унших эхээ сонгоод 60 секундын дотор уламжлалт бичгээ чангаар уншаарай."
        />

        <div className="grid w-full gap-4 lg:grid-cols-[minmax(280px,420px)_1fr] lg:items-center">
          <SearchBar value={query} onChange={setQuery} />
          <div className="lg:justify-self-end">
            <DifficultyTabs value={difficulty} onChange={setDifficulty} />
          </div>
        </div>

        {error && (
          <section className="rounded-2xl border-3 border-red-300 bg-transparent p-4 text-sm font-medium text-red-700 dark:border-red-500/50 dark:text-red-300">
            {error}
          </section>
        )}

        {isLoading ? (
          <section className="rounded-2xl border-3 border-[#E8920A] bg-transparent p-6 text-sm font-semibold text-stone-600 shadow-[0_8px_24px_rgba(232,146,10,0.08)] dark:border-[#84d8ff]/40">
            Уншлагуудыг ачаалж байна...
          </section>
        ) : (
          <ReadingGrid readings={readings} />
        )}
      </div>
    </main>
  );
};
