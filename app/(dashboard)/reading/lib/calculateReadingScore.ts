import { distance } from "fastest-levenshtein";
import type { AlignmentResult, ReadingResult } from "../types/reading";
import { normalizeText, tokenizeWords } from "./normalizeText";

const allowedWordDistance = (word: string): number => {
  if (word.length >= 8) return 2;
  if (word.length >= 4) return 1;
  return 0;
};

export const isWordMatch = (
  targetWord: string,
  speechWord: string,
): boolean => {
  if (targetWord === speechWord) return true;
  if (targetWord.length <= 3) return false;

  return distance(targetWord, speechWord) <= allowedWordDistance(targetWord);
};

const substitutionCost = (targetWord: string, speechWord: string): number => {
  return isWordMatch(targetWord, speechWord) ? 0 : 1;
};

export const alignWords = (
  targetWords: string[],
  speechWords: string[],
): AlignmentResult => {
  const rows = targetWords.length + 1;
  const columns = speechWords.length + 1;
  const dp = Array.from({ length: rows }, () => Array<number>(columns).fill(0));

  for (let i = 1; i < rows; i += 1) {
    dp[i][0] = i;
  }

  for (let j = 1; j < columns; j += 1) {
    dp[0][j] = j;
  }

  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < columns; j += 1) {
      const substitution =
        dp[i - 1][j - 1] +
        substitutionCost(targetWords[i - 1], speechWords[j - 1]);
      const deletion = dp[i - 1][j] + 1;
      const insertion = dp[i][j - 1] + 1;

      dp[i][j] = Math.min(substitution, deletion, insertion);
    }
  }

  let i = targetWords.length;
  let j = speechWords.length;
  let correctWords = 0;
  let missingWords = 0;
  let extraWords = 0;
  let mistakes = 0;

  while (i > 0 || j > 0) {
    if (i === 0) {
      extraWords += 1;
      mistakes += 1;
      j -= 1;
      continue;
    }

    if (j === 0) {
      missingWords += 1;
      mistakes += 1;
      i -= 1;
      continue;
    }

    const targetWord = targetWords[i - 1];
    const speechWord = speechWords[j - 1];
    const cost = substitutionCost(targetWord, speechWord);

    if (dp[i][j] === dp[i - 1][j - 1] + cost) {
      if (cost === 0) {
        correctWords += 1;
      } else {
        mistakes += 1;
      }
      i -= 1;
      j -= 1;
      continue;
    }

    if (dp[i][j] === dp[i - 1][j] + 1) {
      missingWords += 1;
      mistakes += 1;
      i -= 1;
      continue;
    }

    if (dp[i][j] === dp[i][j - 1] + 1) {
      extraWords += 1;
      mistakes += 1;
      j -= 1;
    }
  }

  return {
    correctWords,
    missingWords,
    extraWords,
    mistakes,
  };
};

const clamp = (value: number, min: number, max: number): number => {
  return Math.min(max, Math.max(min, value));
};

const roundPercent = (value: number): number => {
  return Math.round(clamp(value, 0, 100) * 10) / 10;
};

export const calculateReadingScore = (
  targetText: string,
  speechText: string,
  durationSec: number,
): ReadingResult => {
  const targetWords = tokenizeWords(targetText);
  const speechWords = tokenizeWords(speechText);
  const normalizedSpeech = normalizeText(speechText);
  const totalWords = targetWords.length;
  const wordsRead = speechWords.length;
  const charactersRead = normalizedSpeech.length;
  const alignment = alignWords(targetWords, speechWords);
  const minutes = Math.max(durationSec, 1) / 60;

  return {
    mistakes: alignment.mistakes,
    accuracy: roundPercent(
      (alignment.correctWords / Math.max(wordsRead, 1)) * 100,
    ),
    coverage: roundPercent((wordsRead / Math.max(totalWords, 1)) * 100),
    finalScore: roundPercent(
      (alignment.correctWords / Math.max(totalWords, 1)) * 100,
    ),
    wordsRead,
    charactersRead,
    wpm: Math.round(wordsRead / minutes),
    totalWords,
    correctWords: alignment.correctWords,
    missingWords: alignment.missingWords,
    extraWords: alignment.extraWords,
  };
};

export const calculateReadingResult = calculateReadingScore;
