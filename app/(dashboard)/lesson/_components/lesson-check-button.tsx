import { Link2 } from "lucide-react";

import { mnUi } from "@/lib/i18n/mn-ui";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import IncorrectBear from "./lesson-incorrect-animation";
import { TaskType } from "./lesson-types";
import { MatchRenderData } from "./use-lesson-game";

interface LessonCheckButtonProps {
  disabled: boolean;
  onClick: () => void;
  onSkip?: () => void;
  skipped?: boolean;
  correctAnswer?: string;
  onContinue?: () => void;
  isTeaching?: boolean;
  taskType?: TaskType;
  matchData?: MatchRenderData | null;
}

function isImageUrl(value: string): boolean {
  return /^https?:\/\/.+\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(value.trim());
}

/** Latin, URLs, etc. stay horizontal (Balsamiq); traditional Mongolian letters use vertical `mongol-script`. */
function isMongolianScriptText(value: string): boolean {
  return /\p{Script=Mong}/u.test(value);
}

const barShell =
  "w-full border-t border-[#ead9bb] bg-transparent px-4 py-6 sm:px-8 sm:py-8 dark:border-[#37464f]";

const inner = "mx-auto flex w-full max-w-5xl flex-col gap-4 sm:gap-5";

/** Width + shape: matches earlier lesson bar; `rounded-2xl` overrides sortbutton’s pill. */
const lessonSortBtn =
  "w-full rounded-2xl py-3.5 font-black uppercase tracking-widest sm:w-[300px]";

const matchBadgeBase =
  "flex h-10 min-w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#E8920A] bg-[#E8920A] text-sm font-black text-white shadow-none dark:border-[#84d8ff]/50 dark:bg-[#84d8ff]/25 dark:text-white";

function MatchCorrectPairsBadges({ matchData }: { matchData: MatchRenderData }) {
  const leftIndexById = new Map(
    matchData.leftSide.map((item, index) => [item.id, index]),
  );
  const rightLetterById = new Map(
    matchData.rightSide.map((item, index) => [
      item.id,
      String.fromCharCode(65 + index),
    ]),
  );

  return (
    <ul
      className="flex flex-wrap items-center justify-center gap-2 sm:justify-start"
      aria-label="Correct pairs"
    >
      {matchData.pairs.map((pair, i) => {
        const leftIdx = leftIndexById.get(pair.left);
        const letter = rightLetterById.get(pair.right) ?? "?";
        const num =
          typeof leftIdx === "number" ? String(leftIdx + 1) : "?";
        return (
          <li
            key={`${pair.left}-${pair.right}-${i}`}
            className="flex items-center gap-1.5 rounded-full border border-[#E8920A]/50 bg-[#FAD99B]/40 px-2 py-1 dark:border-[#84d8ff]/25 dark:bg-[#253035]/60"
          >
            <span className={matchBadgeBase}>{num}</span>
            <Link2
              className="h-4 w-4 shrink-0 text-[#523403]/70 dark:text-[#94a3b8]"
              aria-hidden
            />
            <span className={matchBadgeBase}>{letter}</span>
          </li>
        );
      })}
    </ul>
  );
}

export function LessonCheckButton({
  disabled,
  onClick,
  onSkip,
  skipped,
  correctAnswer,
  onContinue,
  isTeaching,
  taskType,
  matchData,
}: LessonCheckButtonProps) {
  const showMatchCorrectBadges =
    taskType === "MATCH" &&
    !!matchData &&
    matchData.pairs.length > 0;

  const showSkippedAnswerPanel =
    skipped &&
    (showMatchCorrectBadges || !!correctAnswer?.trim());

  const shouldRenderCorrectAnswerAsImage = !!(
    correctAnswer &&
    isImageUrl(correctAnswer) &&
    !showMatchCorrectBadges
  );
  const correctAnswerUsesMongolianScript =
    !!correctAnswer &&
    isMongolianScriptText(correctAnswer) &&
    !showMatchCorrectBadges;

  if (showSkippedAnswerPanel) {
    return (
      <div className="relative w-full overflow-hidden border-t-2 border-[#E8920A] bg-[#FAD99B] px-4 py-4 sm:px-6 sm:py-5 dark:border-[#84d8ff]/35 dark:bg-[#1a2429]">
        <div
          className="pointer-events-none absolute -bottom-2 -right-2 -z-10 opacity-75 sm:opacity-90"
          aria-hidden
        >
          <div className="hidden w-[88px] sm:block sm:w-[120px] md:w-[140px]">
            <IncorrectBear />
          </div>
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div
              className={cn(
                buttonVariants({ variant: "outline", size: "xs" }),
                "w-fit border-[#E8920A] bg-[#fff8ec]/90 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-[#523403] dark:border-[#84d8ff]/40 dark:bg-[#253035] dark:text-[#e8e4dc]",
              )}
            >
              Correct answer
            </div>

            <div
              className={cn(
                "rounded-2xl bg-[#fff8ec] dark:bg-[#253035]/90",
                showMatchCorrectBadges || shouldRenderCorrectAnswerAsImage
                  ? "flex flex-col items-center gap-2 p-3 sm:p-4"
                  : "px-2 py-2 sm:px-3 sm:py-3",
              )}
            >
              {showMatchCorrectBadges && matchData ? (
                <MatchCorrectPairsBadges matchData={matchData} />
              ) : shouldRenderCorrectAnswerAsImage ? (
                <img
                  src={correctAnswer}
                  alt="Correct answer"
                  width={96}
                  height={96}
                  className="h-24 w-24 shrink-0 rounded-lg object-cover sm:h-28 sm:w-28"
                />
              ) : (
                <p
                  className={cn(
                    "wrap-break-word text-center font-semibold leading-snug text-[#1a1206] dark:text-[#fef3c7]",
                    "min-h-0 sm:text-left",
                    correctAnswerUsesMongolianScript
                      ? "mongol-script text-[60px] leading-tight"
                      : "font-balsamiq text-xl sm:text-2xl",
                  )}
                >
                  {correctAnswer}
                </p>
              )}
            </div>
          </div>

          <div className="flex shrink-0 flex-col justify-center sm:max-w-[min(100%,300px)]">
            <Button
              type="button"
              variant="sortbutton"
              size="sort"
              aria-pressed
              onClick={onContinue}
              className={cn(
                lessonSortBtn,
                "border-[#523403] bg-[#E8920A] text-[#1a1206] shadow-[0_4px_0_#523403] hover:brightness-105 active:translate-y-px active:shadow-[0_2px_0_#523403]",
                "aria-pressed:border-[#523403] aria-pressed:bg-[#E8920A] aria-pressed:text-[#1a1206] aria-pressed:shadow-[0_4px_0_#523403]",
                "dark:border-[#84d8ff] dark:bg-[#84d8ff]/20 dark:text-white dark:shadow-[0_4px_0_#1e3a47]",
                "dark:aria-pressed:border-[#84d8ff] dark:aria-pressed:bg-[#84d8ff]/25 dark:aria-pressed:text-white dark:aria-pressed:shadow-[0_4px_0_#1e3a47]",
              )}
            >
              {mnUi.continue}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isTeaching) {
    return (
      <div className={barShell}>
        <div className={cn(inner, "sm:flex-row sm:justify-end")}>
          <Button
            type="button"
            variant="sortbutton"
            size="sort"
            aria-pressed
            onClick={onClick}
            className={cn(lessonSortBtn, "text-sm")}
          >
            {mnUi.gotIt}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={barShell}>
      <div className={cn(inner, "sm:flex-row sm:items-stretch sm:justify-between")}>
        <Button
          type="button"
          variant="sortbutton"
          size="sort"
          onClick={onSkip}
          className={cn(lessonSortBtn, "text-sm")}
        >
          {mnUi.skip}
        </Button>
        <Button
          type="button"
          variant="sortbutton"
          size="sort"
          aria-pressed={!disabled}
          disabled={disabled}
          onClick={onClick}
          className={cn(
            lessonSortBtn,
            "text-sm",
            disabled &&
              "cursor-not-allowed border-[#5c4a2e]! bg-[#473108]! text-[#6B7280]! shadow-[0_4px_0_#2a2215] opacity-100! hover:translate-y-0! dark:border-[#37464f]! dark:bg-[#252f35]! dark:text-[#64748b]! dark:shadow-[0_4px_0_#15191c]",
          )}
        >
          {mnUi.check}
        </Button>
      </div>
    </div>
  );
}
