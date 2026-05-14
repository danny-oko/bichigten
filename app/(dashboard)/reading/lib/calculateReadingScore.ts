import type { ReadingResult } from "../types/reading";

export const normalizeText = (text: string): string => {
  return text
    .normalize("NFC")
    .trim()
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[.,!?;:«»„“”"'()[\]{}<>—–-]/g, "")
    .replace(/\s+/g, " ");
};

const clamp = (value: number, min = 0, max = 100) => {
  return Math.min(max, Math.max(min, value));
};

const wordLevelDistance = (a: string[], b: string[]): number => {
  const dp: number[][] = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) =>
      i === 0 ? j : j === 0 ? i : 0,
    ),
  );

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }

  return dp[a.length][b.length];
};

export const calculateReadingResult = (
  targetText: string,
  speechText: string,
  durationSec: number,
): ReadingResult => {
  const normTarget = normalizeText(targetText);
  const normSpeech = normalizeText(speechText);

  const targetWords = normTarget.split(" ").filter(Boolean);
  const speechWords = normSpeech.split(" ").filter(Boolean);

  const mistakes = wordLevelDistance(targetWords, speechWords);

  const totalWords = Math.max(targetWords.length, 1);

  const accuracy = clamp(
    Math.round(((totalWords - mistakes) / totalWords) * 100),
  );

  const wordsRead = speechWords.length;

  const safeDurationSec = Math.max(durationSec, 1);
  const wpm = Math.round((wordsRead / safeDurationSec) * 60);

  return {
    mistakes,
    accuracy,
    wordsRead,
    charactersRead: normSpeech.length,
    wpm,
  };
};

export const calculateReadingScore = calculateReadingResult;
