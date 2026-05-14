export type TaskDifficulty = "EASY" | "MEDIUM" | "HARD";
export type TaskType = "MC" | "TRANSLATE" | "MATCH";

export interface McChoice {
  text: string;
  url?: string | null;
}

export interface McOptions {
  choices: McChoice[];
}

export interface MatchPair {
  left: string;
  right: string;
}

export interface MatchSideItem {
  id: string;
  text: string;
}

export interface MatchOptions {
  leftSide: Array<string | MatchSideItem>;
  rightSide: Array<string | MatchSideItem>;
  pairs: MatchPair[];
}

export interface TaskOption {
  text: string;
}

export type TaskOptions =
  | McOptions
  | MatchOptions
  | TaskOption[]
  | string[]
  | null;

export interface LessonContent {
  id: string;
  lessonId: string;
  name: string;
  text: string;
  imageUrl?: string | null;
  order: number;
  animationCss?: string;
  unicode?: string | null;
}

export interface Task {
  id: string;
  lessonId: string;
  type: TaskType;
  difficulty: TaskDifficulty;
  xpReward: number;
  question: string;
  correctAnswer: string;
  options: TaskOptions;
  order: number;
}
