"use client";

import { useMemo, useState } from "react";
import type { ReadingDifficulty } from "../types/reading";

export const useReadingFilter = () => {
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState<ReadingDifficulty>("ALL");

  const searchParams = useMemo(() => {
    const params = new URLSearchParams();
    const trimmedQuery = query.trim();

    if (difficulty !== "ALL") {
      params.set("difficulty", difficulty);
    }

    if (trimmedQuery.length > 0) {
      params.set("search", trimmedQuery);
    }

    return params.toString();
  }, [difficulty, query]);

  return {
    difficulty,
    query,
    searchParams,
    setDifficulty,
    setQuery,
  };
};
