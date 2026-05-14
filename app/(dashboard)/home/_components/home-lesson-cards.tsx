"use client";

import { useNavLoading } from "@/app/_components/nav-loading-context";
import { Check, Lock, Star } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export type Lesson = {
  id: string;
  title: string;
  description?: string | null;
  videoUrl?: string | null;
  order: number;
  levelId: string;
  level?: {
    title: string;
    order: number;
  };
  status?: "done" | "active" | "locked";
};

function toYoutubeEmbedUrl(url: string | null | undefined): string | null {
  if (!url?.trim()) return null;
  const raw = url.trim();
  try {
    const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    const u = new URL(withScheme);
    const host = u.hostname.replace(/^www\./i, "").toLowerCase();

    if (host === "youtu.be") {
      const id = u.pathname.replace(/^\//, "").split("/")[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      if (u.pathname.startsWith("/embed/")) {
        const id = u.pathname.slice("/embed/".length).split("/")[0];
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
      if (u.pathname === "/watch") {
        const v = u.searchParams.get("v");
        return v ? `https://www.youtube.com/embed/${v}` : null;
      }
      if (u.pathname.startsWith("/shorts/")) {
        const id = u.pathname.split("/")[2];
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
      if (u.pathname.startsWith("/live/")) {
        const id = u.pathname.split("/")[2];
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
    }
  } catch {
    return null;
  }
  return null;
}

export const PATH_X = [50, 36, 62, 44, 64, 50, 38, 60];
export const ROW = 160;
export const SECTION_GAP = 150;
export const SW = 340;

export function sortLessonsBySection(lessons: Lesson[]) {
  return [...lessons].sort((a, b) => {
    const sectionOrder = (a.level?.order ?? 0) - (b.level?.order ?? 0);

    return sectionOrder || a.order - b.order;
  });
}

export function getSectionGapCountBefore(lessons: Lesson[], index: number) {
  let gapCount = 0;

  for (let i = 1; i <= index; i++) {
    if (lessons[i]?.levelId !== lessons[i - 1]?.levelId) {
      gapCount += 1;
    }
  }

  return gapCount;
}

export function getLessonSectionIndex(lessons: Lesson[], index: number) {
  let sectionIndex = 0;

  for (let i = index - 1; i >= 0; i--) {
    if (lessons[i]?.levelId !== lessons[index]?.levelId) break;

    sectionIndex += 1;
  }

  return sectionIndex;
}

export function getLessonXPercent(lessons: Lesson[], index: number) {
  const sectionIndex = getLessonSectionIndex(lessons, index);

  return PATH_X[sectionIndex % PATH_X.length];
}

export function getLessonBaseY(lessons: Lesson[], index: number) {
  return index * ROW + getSectionGapCountBefore(lessons, index) * SECTION_GAP;
}

export function getLessonsHeight(lessons: Lesson[]) {
  if (!lessons.length) return 80;

  return (
    lessons.length * ROW +
    getSectionGapCountBefore(lessons, lessons.length - 1) * SECTION_GAP +
    80
  );
}

function assignStatuses(lessons: Lesson[], completedUpTo: number): Lesson[] {
  return sortLessonsBySection(lessons).map((l, i) => ({
    ...l,
    status:
      i < completedUpTo ? "done" : i === completedUpTo ? "active" : "locked",
  }));
}

type ProgressItem = {
  lessonId: string;
  status: "LOCKED" | "IN_PROGRESS" | "COMPLETED";
};

function resolveCompletedUpTo(lessons: Lesson[], progress: ProgressItem[]) {
  const sorted = sortLessonsBySection(lessons);
  const completedSet = new Set(
    progress
      .filter((item) => item.status === "COMPLETED")
      .map((item) => item.lessonId),
  );
  let contiguousCompleted = 0;
  for (const lesson of sorted) {
    if (!completedSet.has(lesson.id)) break;
    contiguousCompleted += 1;
  }
  return contiguousCompleted;
}

export const useLessons = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [completedUpTo, setCompletedUpTo] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/lessons").then((res) => {
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        return res.json();
      }),
      fetch("/api/progress").then((res) => (res.ok ? res.json() : [])),
    ])
      .then(([lessonsData, progressData]: [Lesson[], ProgressItem[]]) => {
        if (!Array.isArray(lessonsData)) return;
        const nextCompletedUpTo = resolveCompletedUpTo(
          lessonsData,
          Array.isArray(progressData) ? progressData : [],
        );
        setCompletedUpTo(nextCompletedUpTo);
        setLessons(assignStatuses(lessonsData, nextCompletedUpTo));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  return { lessons, completedUpTo, loading };
};

export const LessonCards = ({
  lessons,
}: {
  lessons: ReturnType<typeof useLessons>["lessons"];
}) => {
  const { navigateTo } = useNavLoading();
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const embedUrl = selectedLesson
    ? toYoutubeEmbedUrl(selectedLesson.videoUrl)
    : null;

  return (
    <>
      <Dialog
        open={selectedLesson !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedLesson(null);
        }}
      >
        <DialogContent
          showCloseButton
          className={cn(
            "max-h-[min(90vh,640px)] overflow-y-auto sm:max-w-lg",
            "bg-[#F0EDE3] border-[#ead9bb] dark:bg-[#1a2124] dark:border-[#252f35]",
          )}
        >
          {selectedLesson ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-[#0F5238] dark:text-[#4ade80]">
                  {selectedLesson.title}
                </DialogTitle>
                {selectedLesson.description ? (
                  <DialogDescription className="text-[#3b2f2f]/90 dark:text-slate-400">
                    {selectedLesson.description}
                  </DialogDescription>
                ) : (
                  <DialogDescription className="sr-only">
                    Lesson preview
                  </DialogDescription>
                )}
              </DialogHeader>

              <div className="space-y-3">
                {embedUrl ? (
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black shadow-inner">
                    <iframe
                      key={embedUrl}
                      title={`Video preview: ${selectedLesson.title}`}
                      src={embedUrl}
                      className="absolute inset-0 h-full w-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      referrerPolicy="strict-origin-when-cross-origin"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-video w-full items-center justify-center rounded-lg border border-dashed border-[#BFC9C1] bg-[#ECE8D8] text-center text-sm font-medium text-[#7a5930] dark:bg-[#252f35] dark:border-[#37464f] dark:text-slate-400">
                    No preview video available
                  </div>
                )}
              </div>

              <DialogFooter className="mt-2">
                <Button
                  type="button"
                  className="h-11 w-full border-0 dark:bg-[#58cc02] font-bold uppercase tracking-widest text-white dark:hover:bg-[#58cc02]/90 bg-[#ffad33] dark:text-[#131f24] hover:bg-[#ffad33]/80"
                  onClick={() => {
                    navigateTo(`/lesson/${selectedLesson.id}`);
                    setSelectedLesson(null);
                  }}
                >
                  START LESSON
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogTitle className="sr-only">Lesson</DialogTitle>
              <DialogDescription className="sr-only">
                Lesson details
              </DialogDescription>
            </>
          )}
        </DialogContent>
      </Dialog>

      {lessons.map((l, i) => {
        const isLocked = l.status === "locked";
        const isDone = l.status === "done";
        const isActive = l.status === "active";
        const Icon = isLocked ? Lock : isDone ? Check : Star;
        const xPos = getLessonXPercent(lessons, i);

        return (
          <div
            key={l.id}
            className="absolute flex flex-col items-center transition-all duration-500"
            style={{
              left: `${xPos}%`,
              top: `${getLessonBaseY(lessons, i) + 20}px`,
              transform: "translateX(-50%)",
              zIndex: 10,
            }}
          >
            <button
              disabled={isLocked}
              onClick={() => {
                if (!isLocked) setSelectedLesson(l);
              }}
              style={{
                width: isActive ? 80 : 80,
                height: isActive ? 60 : 60,
              }}
              className={cn(
                "relative flex items-center justify-center rounded-full border-2 transition-all duration-300",
                isActive && !isLocked
                  ? "hover:-translate-y-1 active:translate-y-0 active:brightness-90 scale-105"
                  : "scale-100",
                isLocked
                  ? "cursor-not-allowed border-2 border-[#BFC9C1] bg-[#E8E5DC] shadow-[0_5px_0_#b0b8b2] dark:border-[#3f4a52] dark:bg-[#1a2124] dark:shadow-[0_5px_0_#0d1215]"
                  : isDone
                    ? "cursor-pointer border-solid border-[#1a4d0f] bg-[#2C6601] shadow-[0_5px_0_#0f3d00] dark:border-[#1e5240] dark:bg-[#1a3d2e] dark:shadow-[0_5px_0_#09120f]"
                    : "cursor-pointer border-solid border-[#cc8a29] bg-[#ffad33] shadow-[0_5px_0_#cc8a29] dark:border-[#3d9e02] dark:bg-[#58cc02] dark:shadow-[0_5px_0_rgba(0,118,255,0.39)]",
              )}
            >
              <Icon
                size={isLocked ? 24 : isDone ? 28 : 40}
                strokeWidth={2}
                className={cn(
                  isLocked
                    ? "dark:text-[#BFC9C1] text-[#52606b]"
                    : "text-white dark:text-[#131f24]",
                  isDone ? "fill-transparent" : "",
                )}
              />
            </button>

            {isActive && (
              <div className="mt-3 mx-auto max-w-[min(85vw,11rem)] rounded-2xl dark:bg-[#58cc02] bg-[#ffad33] px-4 py-1.5 text-center text-[13px] font-bold uppercase leading-snug tracking-widest text-white dark:text-[#131f24] wrap-break-word sm:max-w-none sm:whitespace-nowrap sm:rounded-full sm:px-5">
                {l.title}
              </div>
            )}

            {!isActive && (
              <p
                className={cn(
                  "mt-2 mx-auto max-w-[min(85vw,11rem)] rounded-2xl border-2 px-3 py-1.5 text-center text-[13px] font-bold leading-snug wrap-break-word sm:max-w-none sm:whitespace-nowrap",
                  isLocked
                    ? "border-2 border-[#BFC9C1] bg-[#E8E5DC] text-[#64748b] dark:border-[#3f4a52] dark:bg-[#1a2124] dark:text-[#94a3b8]"
                    : "border-solid border-[#1a4d0f]/50 bg-[#e2f4e6] text-[#0F5238] dark:border-[#236341] dark:bg-[#132a24] dark:text-[#86efac]",
                )}
              >
                {l.title}
              </p>
            )}
          </div>
        );
      })}
    </>
  );
};
