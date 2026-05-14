import { useEffect, useRef, useState } from "react";
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
    const styleMap: Record<
      string,
      { border: string; color: string; shadow: string }
    > = {
      active: {
        border: "#523403",
        color: "#523403",
        shadow: "0 4px 10px #523403",
      },
      correct: {
        border: "#22C55E",
        color: "#22C55E",
        shadow: "0 4px 0 #15803D",
      },
      wrong: { border: "#EF4444", color: "#EF4444", shadow: "0 4px 0 #991B1B" },
      dismissed: {
        border: "#374151",
        color: "#6B7280",
        shadow: "none",
      },
      default: {
        border: "#E8930A",
        color: "#000000",
        shadow: "0 4px 0 #E8930A",
      },
    };

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
            <p className="text-xs font-black uppercase tracking-widest text-[#6B7280]">
              Left Side
            </p>
            {leftButtons.map((btn, index) => {
              const state = getButtonState(btn);
              const s = styleMap[state] ?? styleMap.default;
              return (
                <button
                  key={`left-${btn.id}`}
                  onClick={() => handleButtonClick(btn)}
                  disabled={state === "dismissed"}
                  className={`w-full rounded-2xl border-2 px-4 py-3 text-left text-sm font-bold transition-all ${
                    state === "wrong" ? "anim-shake" : ""
                  } ${state === "correct" ? "anim-pop" : ""} ${
                    state === "dismissed"
                      ? "opacity-40 cursor-default translate-y-1"
                      : ""
                  }`}
                  style={{
                    background: "#FAD99B",
                    borderColor: s.border,
                    color: s.color,
                    boxShadow: s.shadow,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="inline-flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full px-2 text-xs font-black text-white"
                      style={{ backgroundColor: s.border }}
                    >
                      {index + 1}
                    </span>
                    <span className="flex-1">{btn.text}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="space-y-3">
            <p className="text-xs font-black uppercase tracking-widest text-[#6B7280]">
              Right Side
            </p>
            {rightButtons.map((btn, index) => {
              const state = getButtonState(btn);
              const s = styleMap[state] ?? styleMap.default;
              const badge = String.fromCharCode(65 + index);
              return (
                <button
                  key={`right-${btn.id}`}
                  onClick={() => handleButtonClick(btn)}
                  disabled={state === "dismissed"}
                  className={`w-full rounded-2xl border-2 px-4 py-3 text-left text-sm font-bold transition-all ${
                    state === "wrong" ? "anim-shake" : ""
                  } ${state === "correct" ? "anim-pop" : ""} ${
                    state === "dismissed"
                      ? "opacity-40 cursor-default translate-y-1"
                      : ""
                  }`}
                  style={{
                    background: "#FAD99B",
                    borderColor: s.border,
                    color: s.color,
                    boxShadow: s.shadow,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="inline-flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full px-2 text-xs font-black text-white"
                      style={{ backgroundColor: s.border }}
                    >
                      {badge}
                    </span>
                    <span>{btn.text}</span>
                  </div>
                </button>
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
          <button
            key={`${choice.value}-${index}`}
            onClick={() => onSelect(choice.value)}
            className="flex flex-col items-center justify-center rounded-2xl border-2 p-5 transition-all duration-100 active:scale-95"
            style={{
              background: "#FAD99B",
              borderColor: selected === choice.value ? "#523403" : "#E8920A",
              boxShadow:
                selected === choice.value
                  ? "0 4px 10px #523403"
                  : "0 4px 0 #E8920A",
              color: selected === choice.value ? "#8A5706" : "#000000",
            }}
          >
            <span className="text-md sm:text-lg font-black">
              {choice.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
