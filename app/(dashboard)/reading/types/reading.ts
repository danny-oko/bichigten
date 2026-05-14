export type ReadingStatus =
  | "idle"
  | "recording"
  | "transcribing"
  | "done"
  | "error";

export type ReadingDifficulty = "ALL" | "EASY" | "MEDIUM" | "HARD";

export type Reading = {
  id: string;
  createdAt: string;
  updatedAt: string;
  lessonId: string | null;
  title: string;
  description: string | null;
  difficulty: Exclude<ReadingDifficulty, "ALL">;
  requiredAccuracy: number | null;
  xpReward: number;
  isRequired?: boolean;
  wordsCount: number;
  cyrillicText: string;
  traditionalText: string;
  latestAttempt?: ReadingAttemptSummary | null;
  bestAttempt?: ReadingAttemptSummary | null;
  completed?: boolean;
  isPassed?: boolean;
  xpEarned?: number;
  _count?: {
    attempts: number;
  };
};

export type ReadingCardData = Pick<
  Reading,
  | "id"
  | "title"
  | "description"
  | "difficulty"
  | "requiredAccuracy"
  | "xpReward"
  | "wordsCount"
> & {
  latestAttempt: ReadingAttemptCardSummary | null;
  bestAttempt: ReadingAttemptCardSummary | null;
  completed: boolean;
  isPassed: boolean;
  xpEarned: number;
};

export type ReadingAttemptCardSummary = Pick<
  ReadingAttemptSummary,
  "id" | "createdAt" | "accuracy" | "finalScore" | "isPassed" | "xpEarned"
>;

export type ReadingAttemptSummary = {
  id: string;
  createdAt: string;
  accuracy: number;
  coverage: number;
  finalScore: number;
  mistakes: number;
  wordsRead: number;
  charactersRead: number;
  wpm: number;
  isPassed: boolean;
  xpEarned: number;
  durationSec: number;
};

export type TranscribeResponse = {
  data?: string;
  error?: string;
};

export type ReadingResult = {
  mistakes: number;
  accuracy: number;
  coverage: number;
  finalScore: number;
  wordsRead: number;
  charactersRead: number;
  wpm: number;
  totalWords: number;
  correctWords: number;
  missingWords: number;
  extraWords: number;
  isPassed?: boolean;
};

export type AlignmentResult = {
  correctWords: number;
  missingWords: number;
  extraWords: number;
  mistakes: number;
};
