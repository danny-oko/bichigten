import { useEffect, useRef, useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { TaskType } from "./lesson-types";
import { LessonChoice, MatchRenderData } from "./use-lesson-game";

interface LessonChoiceGridProps {
  taskType: TaskType;
  matchData: MatchRenderData | null;
  choices: LessonChoice[];
  selected: string | null;
  matchFeedback: "correct" | "incorrect" | null;
  onSelect: (choice: string) => void;
  onMatchFeedbackDone: () => void;
}

type MatchSide = "left" | "right";

interface MatchButton {
  id: string;
  text: string;
  side: MatchSide;
}

function isImageUrl(value: string): boolean {
  return /^https?:\/\/.+\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(value.trim());
}

function isMongolianScriptText(value: string): boolean {
  return /\p{Script=Mong}/u.test(value);
}

function MatchButtonFace({ text }: { text: string }) {
  const trimmed = text.trim();
  if (trimmed && isImageUrl(trimmed)) {
    return (
      <span className="flex min-w-0 flex-1 justify-center">
        <img
          src={trimmed}
          alt="Match option"
          className="max-h-20 w-auto max-w-full rounded-md object-contain sm:max-h-24"
        />
      </span>
    );
  }
  if (isMongolianScriptText(trimmed)) {
    return (
      <span className="flex min-w-0 flex-1 items-center justify-center">
        <span
          className={cn(
            "mongol-script inline-block max-w-full min-w-0 whitespace-normal wrap-break-word text-pretty text-center font-semibold",
            "text-[60px] leading-tight",
          )}
        >
          {text}
        </span>
      </span>
    );
  }
  return (
    <span className="min-w-0 flex-1 wrap-break-word text-pretty text-left font-balsamiq text-base font-bold sm:text-lg">
      {text}
    </span>
  );
}

function McChoiceFace({ choice }: { choice: LessonChoice }) {
  const url = choice.url?.trim();
  const primary = url && url.length > 0 ? url : choice.label;

  if (url && isImageUrl(url)) {
    return (
      <span className="flex w-full flex-col items-center gap-2">
        <img
          src={url}
          alt={choice.label || "Choice"}
          className="max-h-40 w-full max-w-[260px] rounded-lg object-contain sm:max-h-48 sm:max-w-[300px]"
        />
      </span>
    );
  }

  if (url) {
    return (
      <span className="flex w-full min-w-0 items-center justify-center">
        <span
          className={cn(
            "mongol-script inline-block max-w-full min-w-0 whitespace-normal wrap-break-word text-pretty text-center font-semibold leading-snug",
            "text-[60px] leading-tight",
          )}
        >
          {primary}
        </span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        "font-balsamiq block w-full min-w-0 whitespace-normal wrap-break-word text-pretty text-center text-base font-black sm:text-lg md:text-xl",
      )}
    >
      {choice.label}
    </span>
  );
}

export function LessonChoiceGrid({
  taskType,
  matchData,
  choices,
  selected,
  matchFeedback,
  onSelect,
  onMatchFeedbackDone,
}: LessonChoiceGridProps) {
  const [activeButton, setActiveButton] = useState<{
    id: string;
    side: MatchSide;
  } | null>(null);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [wrongPair, setWrongPair] = useState<{
    leftId: string;
    rightId: string;
  } | null>(null);
  const [correctPair, setCorrectPair] = useState<{
    leftId: string;
    rightId: string;
  } | null>(null);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!matchFeedback) return;
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);

    const duration = matchFeedback === "correct" ? 3000 : 2000;
    feedbackTimer.current = setTimeout(() => {
      onMatchFeedbackDone();
    }, duration);

    return () => {
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    };
  }, [matchFeedback]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleButtonClick(btn: MatchButton) {
    if (dismissed.has(btn.id) || wrongPair || correctPair) return;

    if (!activeButton) {
      setActiveButton({ id: btn.id, side: btn.side });
      return;
    }

    if (activeButton.id === btn.id && activeButton.side === btn.side) {
      setActiveButton(null);
      return;
    }

    if (activeButton.side === btn.side) {
      setActiveButton({ id: btn.id, side: btn.side });
      return;
    }

    const leftId = activeButton.side === "left" ? activeButton.id : btn.id;
    const rightId = activeButton.side === "right" ? activeButton.id : btn.id;
    const isCorrect = matchData?.pairs.some(
      (p) => p.left === leftId && p.right === rightId,
    );

    if (isCorrect) {
      setCorrectPair({ leftId, rightId });
      setActiveButton(null);
      setTimeout(() => {
        setDismissed((prev) => {
          const next = new Set(prev);
          next.add(leftId);
          next.add(rightId);
          return next;
        });
        setCorrectPair(null);
        const remainingCount =
          (matchData?.leftSide.length ?? 0) - (dismissed.size / 2 + 1);
        if (remainingCount === 0) {
          onSelect(
            JSON.stringify(
              Object.fromEntries(
                matchData!.pairs.map((p) => [p.left, p.right]),
              ),
            ),
          );
        }
      }, 600);
    } else {
      setWrongPair({ leftId, rightId });
      setActiveButton(null);
      setTimeout(() => setWrongPair(null), 700);
    }
  }

  function getButtonState(
    btn: MatchButton,
  ): "dismissed" | "correct" | "wrong" | "active" | "default" {
    if (dismissed.has(btn.id)) return "dismissed";
    if (
      correctPair &&
      (btn.id === correctPair.leftId || btn.id === correctPair.rightId)
    )
      return "correct";
    if (
      wrongPair &&
      (btn.id === wrongPair.leftId || btn.id === wrongPair.rightId)
    )
      return "wrong";
    if (activeButton?.id === btn.id && activeButton?.side === btn.side)
      return "active";
    return "default";
  }

  if (taskType === "MATCH" && matchData) {
    const leftButtons = matchData.leftSide.map((item) => ({
      id: item.id,
      text: item.text,
      side: "left" as MatchSide,
    }));
    const rightButtons = matchData.rightSide.map((item) => ({
      id: item.id,
      text: item.text,
      side: "right" as MatchSide,
    }));

    return (
      <>
        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            15%       { transform: translateX(-5px); }
            30%       { transform: translateX(5px); }
            45%       { transform: translateX(-4px); }
            60%       { transform: translateX(4px); }
            75%       { transform: translateX(-2px); }
            90%       { transform: translateX(2px); }
          }
          @keyframes pop {
            0%   { transform: scale(1); }
            40%  { transform: scale(1.06); }
            100% { transform: scale(1); }
          }
          .anim-shake { animation: shake 0.65s ease-in-out; }
          .anim-pop   { animation: pop 0.5s ease-out; }
        `}</style>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-3">
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              Left Side
            </p>
            {leftButtons.map((btn, index) => {
              const state = getButtonState(btn);
              return (
                <Button
                  key={`left-${btn.id}`}
                  type="button"
                  variant="sortbutton"
                  size="sort"
                  disabled={state === "dismissed"}
                  aria-pressed={state === "active"}
                  onClick={() => handleButtonClick(btn)}
                  className={cn(
                    "h-auto w-full min-w-0 shrink justify-start whitespace-normal rounded-2xl border-2 bg-[#FAD99B] py-3 text-left text-sm font-bold text-foreground shadow-none transition-all hover:translate-y-0 dark:bg-[#FAD99B]/90",
                    state === "wrong" &&
                      "anim-shake border-destructive text-destructive shadow-none",
                    state === "correct" &&
                      "anim-pop border-emerald-600 text-emerald-800 shadow-none",
                    state === "dismissed" &&
                      "translate-y-px cursor-default opacity-40 shadow-none",
                    state === "active" &&
                      "border-[#523403] text-[#523403] shadow-none",
                    state === "default" && "border-[#E8920A]",
                  )}
                >
                  <div className="flex w-full min-w-0 items-center gap-3">
                    <span
                      className={cn(
                        buttonVariants({ variant: "default", size: "icon-xs" }),
                        "shrink-0 rounded-full text-xs font-black text-primary-foreground",
                        state === "wrong" && "bg-destructive",
                        state === "correct" && "bg-emerald-600",
                        state === "dismissed" &&
                          "bg-muted text-muted-foreground",
                        state === "active" && "bg-[#523403]",
                        state === "default" && "bg-[#E8920A]",
                      )}
                    >
                      {index + 1}
                    </span>
                    <MatchButtonFace text={btn.text} />
                  </div>
                </Button>
              );
            })}
          </div>

          <div className="space-y-3">
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              Right Side
            </p>
            {rightButtons.map((btn, index) => {
              const state = getButtonState(btn);
              const badge = String.fromCharCode(65 + index);
              return (
                <Button
                  key={`right-${btn.id}`}
                  type="button"
                  variant="sortbutton"
                  size="sort"
                  disabled={state === "dismissed"}
                  aria-pressed={state === "active"}
                  onClick={() => handleButtonClick(btn)}
                  className={cn(
                    "h-auto w-full min-w-0 shrink justify-start whitespace-normal rounded-2xl border-2 bg-[#FAD99B] py-3 text-left text-sm font-bold text-foreground shadow-none transition-all hover:translate-y-0 dark:bg-[#FAD99B]/90",
                    state === "wrong" &&
                      "anim-shake border-destructive text-destructive shadow-none",
                    state === "correct" &&
                      "anim-pop border-emerald-600 text-emerald-800 shadow-none",
                    state === "dismissed" &&
                      "translate-y-px cursor-default opacity-40 shadow-none",
                    state === "active" &&
                      "border-[#523403] text-[#523403] shadow-none",
                    state === "default" && "border-[#E8920A]",
                  )}
                >
                  <div className="flex w-full min-w-0 items-center gap-3">
                    <span
                      className={cn(
                        buttonVariants({ variant: "default", size: "icon-xs" }),
                        "shrink-0 rounded-full text-xs font-black text-primary-foreground",
                        state === "wrong" && "bg-destructive",
                        state === "correct" && "bg-emerald-600",
                        state === "dismissed" &&
                          "bg-muted text-muted-foreground",
                        state === "active" && "bg-[#523403]",
                        state === "default" && "bg-[#E8920A]",
                      )}
                    >
                      {badge}
                    </span>
                    <MatchButtonFace text={btn.text} />
                  </div>
                </Button>
              );
            })}
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {choices.map((choice, index) => (
          <Button
            key={`${choice.value}-${index}`}
            type="button"
            variant="sortbutton"
            size="sort"
            aria-pressed={selected === choice.value}
            onClick={() => onSelect(choice.value)}
            className={cn(
              "h-auto min-h-20 w-full min-w-0 shrink flex-col gap-1.5 whitespace-normal rounded-2xl border-2 border-[#E8920A] bg-[#FAD99B] px-2.5 py-3 font-black text-foreground shadow-none hover:translate-y-0 sm:min-h-24 sm:px-3 sm:py-3.5 dark:bg-[#FAD99B]/90",
              selected === choice.value &&
                "border-[#523403] text-[#8A5706] shadow-none dark:text-[#8A5706]",
            )}
          >
            <McChoiceFace choice={choice} />
          </Button>
        ))}
      </div>
    </div>
  );
}
