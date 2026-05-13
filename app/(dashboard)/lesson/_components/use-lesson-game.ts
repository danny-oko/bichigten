"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  LessonContent,
  MatchOptions,
  McOptions,
  Task,
  TaskOption,
} from "./lesson-types";
import { LessonReviewStats } from "./lesson-review-types";

type Phase = "teaching" | "tasks";

interface State {
  contents: LessonContent[];
  contentIndex: number;
  tasks: Task[];
  taskIndex: number;
  phase: Phase;
  hearts: number;
  selected: string | null;
  reviewStats: LessonReviewStats | null;
  isFailed: boolean;
  matchFeedback: "correct" | "incorrect" | null;
}

export interface LessonChoice {
  value: string;
  label: string;
}

export interface MatchRenderItem {
  id: string;
  text: string;
}

export interface MatchRenderData {
  leftSide: MatchRenderItem[];
  rightSide: MatchRenderItem[];
  pairs: { left: string; right: string }[];
}

function sanitizeChoices(
  items: Array<{ value: unknown; label?: unknown }>,
): LessonChoice[] {
  return items
    .map((item) => {
      const value = toText(item.value);
      const label = toText(item.label ?? item.value);
      return { value, label };
    })
    .filter((item) => item.value);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function isMcOptions(value: unknown): value is McOptions {
  return (
    !!value &&
    typeof value === "object" &&
    "choices" in value &&
    !!(value as { choices?: unknown }).choices
  );
}

function isMatchOptions(value: unknown): value is MatchOptions {
  return (
    !!value &&
    typeof value === "object" &&
    "leftSide" in value &&
    "rightSide" in value &&
    "pairs" in value
  );
}

function toText(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean")
    return String(value);
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (typeof record.text === "string") return record.text;
    if (typeof record.label === "string") return record.label;
    if (typeof record.value === "string") return record.value;
    if (typeof record.id === "string") return record.id;
  }
  return "";
}

function extractMcChoices(
  value: unknown,
): Array<{ value: unknown; label?: unknown }> {
  if (!value || typeof value !== "object") return [];
  const rawChoices = (value as { choices?: unknown }).choices;

  if (Array.isArray(rawChoices)) {
    return rawChoices.map((choice) => {
      if (typeof choice === "string") return { value: choice, label: choice };
      const record = choice as Record<string, unknown>;
      const text = toText(
        record.text ?? record.label ?? record.value ?? record.id,
      );
      return { value: text, label: text };
    });
  }

  if (rawChoices && typeof rawChoices === "object") {
    return Object.values(rawChoices as Record<string, unknown>).map(
      (choice) => {
        if (typeof choice === "string") return { value: choice, label: choice };
        const record = choice as Record<string, unknown>;
        const text = toText(
          record.text ?? record.label ?? record.value ?? record.id,
        );
        return { value: text, label: text };
      },
    );
  }

  if (typeof rawChoices === "string")
    return [{ value: rawChoices, label: rawChoices }];
  return [];
}

function parseTaskOptions(options: unknown): unknown {
  if (typeof options !== "string") return options;
  try {
    return JSON.parse(options);
  } catch {
    return options;
  }
}

function extractMatchSideItems(
  side: unknown,
): Array<{ id: string; text: string }> {
  if (!Array.isArray(side)) return [];
  return side
    .map((item, index) => {
      if (typeof item === "string") return { id: `${index}`, text: item };
      if (item && typeof item === "object") {
        const record = item as Record<string, unknown>;
        const id = toText(record.id ?? index);
        const text = toText(
          record.text ?? record.label ?? record.value ?? record.id,
        );
        return { id, text };
      }
      return { id: `${index}`, text: "" };
    })
    .filter((item) => item.text);
}

function normalizeMatchData(options: unknown): MatchRenderData | null {
  if (!isMatchOptions(options)) return null;
  const leftSide = extractMatchSideItems(options.leftSide);
  const rightSide = extractMatchSideItems(options.rightSide);
  const pairs = Array.isArray(options.pairs)
    ? options.pairs
        .map((pair) => ({ left: toText(pair.left), right: toText(pair.right) }))
        .filter((pair) => pair.left && pair.right)
    : [];
  return { leftSide, rightSide, pairs };
}

function isMatchSelectionCorrect(task: Task, selected: string | null): boolean {
  if (task.type !== "MATCH" || !selected) return false;
  const options = parseTaskOptions(task.options);
  const matchData = normalizeMatchData(options);
  if (!matchData || !matchData.pairs.length) return false;
  try {
    const parsed = JSON.parse(selected) as Record<string, string>;
    const selectedPairs = Object.entries(parsed);
    if (selectedPairs.length !== matchData.pairs.length) return false;
    return matchData.pairs.every((pair) => parsed[pair.left] === pair.right);
  } catch {
    return false;
  }
}

async function saveProgress(
  lessonId: string,
  userId: string,
  heartsRemaining: number,
  xpEarned: number,
  status: "COMPLETED" | "IN_PROGRESS" = "IN_PROGRESS",
) {
  try {
    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lessonId,
        userId,
        heartsRemaining,
        xpEarned,
        status,
      }),
    });
  } catch {}
}

export function useLessonGame(lessonId: string, userId: string) {
  const [state, setState] = useState<State>({
    contents: [],
    contentIndex: 0,
    tasks: [],
    taskIndex: 0,
    phase: "teaching",
    hearts: 5,
    selected: null,
    reviewStats: null,
    isFailed: false,
    matchFeedback: null,
  });

  const correctRef = useRef(0);
  const totalRef = useRef(0);
  const earnedXpRef = useRef(0);
  const startRef = useRef(Date.now());
  const awardedXpTasksRef = useRef(new Set<string>());
  const saveProgressCalledRef = useRef(false);

  useEffect(() => {
    saveProgressCalledRef.current = false;
    earnedXpRef.current = 0;
    correctRef.current = 0;
    totalRef.current = 0;
    awardedXpTasksRef.current = new Set();

    Promise.all([
      fetch(`/api/lesson-contents?lessonId=${lessonId}`).then((r) => r.json()),
      fetch(`/api/tasks?lessonId=${lessonId}`).then((r) => r.json()),
      fetch(`/api/users/${userId}`).then((r) => (r.ok ? r.json() : null)),
    ])
      .then(
        ([contents, tasks, userData]: [
          LessonContent[],
          Task[],
          { heartsRemaining: number } | null,
        ]) => {
          const heartsFromUser = userData?.heartsRemaining ?? 5;
          startRef.current = Date.now();
          setState((s) => ({
            ...s,
            contents: contents.sort((a, b) => a.order - b.order),
            tasks: tasks.sort((a, b) => a.order - b.order),
            hearts: Math.max(0, Math.min(5, heartsFromUser)),
            loading: false,
          }));
        },
      )
      .catch(() => setState((s) => ({ ...s, loading: false })));
  }, [lessonId, userId]);

  const {
    phase,
    contents,
    contentIndex,
    tasks,
    taskIndex,
    hearts,
    selected,
    reviewStats,
    isFailed,
    matchFeedback,
  } = state;

  const currentContent = contents[contentIndex] ?? null;
  const currentTask = tasks[taskIndex] ?? null;
  const currentOptions = useMemo(
    () => (currentTask ? parseTaskOptions(currentTask.options) : null),
    [currentTask],
  );
  const matchData = useMemo(
    () =>
      currentTask?.type === "MATCH" ? normalizeMatchData(currentOptions) : null,
    [currentOptions, currentTask?.type],
  );

  const totalSteps = contents.length + tasks.length;
  const completedSteps =
    phase === "teaching" ? contentIndex : contents.length + taskIndex;
  const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  const choices: LessonChoice[] = useMemo(() => {
    if (!currentTask) return [];
    const parsedOptions = currentOptions;
    if (Array.isArray(parsedOptions) && parsedOptions.length) {
      const normalized = sanitizeChoices(
        parsedOptions.map((option) => {
          if (typeof option === "string")
            return { value: option, label: option };
          const item = option as TaskOption & {
            label?: string;
            value?: string;
            id?: string;
          };
          const textValue = toText(
            item.text ?? item.label ?? item.value ?? item.id,
          );
          return { value: textValue, label: textValue };
        }),
      );
      return shuffle(normalized);
    }
    if (isMcOptions(parsedOptions))
      return shuffle(sanitizeChoices(extractMcChoices(parsedOptions)));
    if (currentTask.type === "MATCH" && isMatchOptions(parsedOptions)) {
      const leftChoices = extractMatchSideItems(parsedOptions.leftSide).map(
        (item) => ({ value: `L:${item.id}`, label: item.text }),
      );
      const rightChoices = extractMatchSideItems(parsedOptions.rightSide).map(
        (item) => ({ value: `R:${item.id}`, label: item.text }),
      );
      return shuffle(
        sanitizeChoices(
          [...leftChoices, ...rightChoices].map((item) => ({
            ...item,
            label: item.value.startsWith("L:")
              ? `Left: ${item.label}`
              : `Right: ${item.label}`,
          })),
        ),
      );
    }
    const others = sanitizeChoices(
      tasks
        .filter((t) => t.id !== currentTask.id)
        .map((t) => ({ value: t.correctAnswer, label: t.correctAnswer }))
        .slice(0, 3),
    );
    return shuffle(
      sanitizeChoices([
        ...others,
        { value: currentTask.correctAnswer, label: currentTask.correctAnswer },
      ]),
    );
  }, [currentTask, currentOptions, tasks]);

  const setSelected = useCallback((val: string | null) => {
    setState((s) => ({ ...s, selected: val }));
  }, []);

  function advanceContent() {
    setState((s) => {
      const next = s.contentIndex + 1;
      if (next < s.contents.length)
        return { ...s, contentIndex: next, selected: null };
      if (!s.tasks.length)
        return { ...s, selected: null, reviewStats: buildReview(s.hearts) };
      return { ...s, phase: "tasks", selected: null };
    });
  }

  function checkTaskAnswer(skip = false) {
    setState((s) => {
      if (!currentTask) return s;
      const shouldCountForReview = currentTask.type !== "MATCH";
      if (shouldCountForReview) totalRef.current += 1;

      const isCorrect =
        !skip &&
        (currentTask.type === "MATCH"
          ? isMatchSelectionCorrect(currentTask, s.selected)
          : s.selected === currentTask.correctAnswer);

      if (isCorrect && shouldCountForReview) correctRef.current += 1;
      if (isCorrect) {
        if (!awardedXpTasksRef.current.has(currentTask.id)) {
          awardedXpTasksRef.current.add(currentTask.id);
          earnedXpRef.current += currentTask.xpReward;
        }
      }

      if (currentTask.type === "MATCH" && !skip && !isCorrect)
        return { ...s, matchFeedback: "incorrect" };
      if (currentTask.type === "MATCH" && isCorrect)
        return { ...s, matchFeedback: "correct" };

      const nextHearts =
        !skip && !isCorrect ? Math.max(0, s.hearts - 1) : s.hearts;
      if (nextHearts === 0) {
        saveProgress(lessonId, userId, 0, calcXp(), "IN_PROGRESS");
        return { ...s, hearts: 0, selected: null, isFailed: true };
      }
      if (!skip && !isCorrect)
        return { ...s, hearts: nextHearts, selected: null };

      const nextTaskIndex = s.taskIndex + 1;
      if (nextTaskIndex < s.tasks.length)
        return {
          ...s,
          taskIndex: nextTaskIndex,
          hearts: nextHearts,
          selected: null,
        };

      if (!saveProgressCalledRef.current) {
        saveProgressCalledRef.current = true;
        saveProgress(lessonId, userId, nextHearts, calcXp(), "COMPLETED");
      }
      return {
        ...s,
        hearts: nextHearts,
        selected: null,
        reviewStats: buildReview(nextHearts),
      };
    });
  }

  function clearMatchFeedback() {
    setState((s) => ({
      ...s,
      matchFeedback: null,
      selected: s.matchFeedback === "incorrect" ? null : s.selected,
    }));
  }

  function advanceMatchTask() {
    setState((s) => {
      const nextHearts = s.hearts;
      const nextTaskIndex = s.taskIndex + 1;
      if (nextTaskIndex < s.tasks.length)
        return {
          ...s,
          taskIndex: nextTaskIndex,
          hearts: nextHearts,
          selected: null,
          matchFeedback: null,
        };

      if (!saveProgressCalledRef.current) {
        saveProgressCalledRef.current = true;
        saveProgress(lessonId, userId, nextHearts, calcXp(), "COMPLETED");
      }
      return {
        ...s,
        hearts: nextHearts,
        selected: null,
        matchFeedback: null,
        reviewStats: buildReview(nextHearts),
      };
    });
  }

  function buildReview(remainingHearts: number): LessonReviewStats {
    return {
      xpEarned: calcXp(),
      totalQuestions: totalRef.current,
      correctAnswers: correctRef.current,
      heartsRemaining: remainingHearts,
      timeSeconds: Math.round((Date.now() - startRef.current) / 1000),
    };
  }

  function calcXp() {
    return earnedXpRef.current;
  }

  async function refillHeartsForFirstWeek() {
    const refillHearts = 5;
    setState((s) => ({
      ...s,
      hearts: refillHearts,
      isFailed: false,
      selected: null,
    }));
    await saveProgress(lessonId, userId, refillHearts, calcXp(), "IN_PROGRESS");
  }

  return {
    phase,
    currentContent,
    currentTask,
    matchData,
    choices,
    selected,
    setSelected,
    hearts,
    progress,
    isFailed,
    reviewStats,
    matchFeedback,
    advanceContent,
    checkTaskAnswer,
    clearMatchFeedback,
    advanceMatchTask,
    refillHeartsForFirstWeek,
  };
}
