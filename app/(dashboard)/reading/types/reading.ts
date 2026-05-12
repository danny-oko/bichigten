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
  title: string;
  description: string | null;
  difficulty: Exclude<ReadingDifficulty, "ALL">;
  requiredAccuracy: number | null;
  wordsCount: number;
  cyrillicText: string;
  traditionalText: string;
  _count?: {
    attempts: number;
  };
};

export type TranscribeResponse = {
  data: string;
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
};

export type AlignmentResult = {
  correctWords: number;
  missingWords: number;
  extraWords: number;
  mistakes: number;
};
