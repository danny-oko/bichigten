import { mnUi } from "@/lib/i18n/mn-ui";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import IncorrectBear from "./lesson-incorrect-animation";

interface LessonCheckButtonProps {
  disabled: boolean;
  onClick: () => void;
  onSkip?: () => void;
  skipped?: boolean;
  correctAnswer?: string;
  onContinue?: () => void;
  isTeaching?: boolean;
}

function isImageUrl(value: string): boolean {
  return /^https?:\/\/.+\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(value.trim());
}

const barShell =
  "w-full border-t border-[#ead9bb] bg-transparent px-4 py-6 sm:px-8 sm:py-8 dark:border-[#37464f]";

const inner = "mx-auto flex w-full max-w-5xl flex-col gap-4 sm:gap-5";

/** Width + shape: matches earlier lesson bar; `rounded-2xl` overrides sortbutton’s pill. */
const lessonSortBtn =
  "w-full rounded-2xl py-3.5 font-black uppercase tracking-widest sm:w-[300px]";

export function LessonCheckButton({
  disabled,
  onClick,
  onSkip,
  skipped,
  correctAnswer,
  onContinue,
  isTeaching,
}: LessonCheckButtonProps) {
  const shouldRenderCorrectAnswerAsImage = !!(
    correctAnswer && isImageUrl(correctAnswer)
  );

  if (skipped && correctAnswer) {
    return (
      <div className="relative w-full overflow-hidden border-t-4 border-[#FF4B4B] bg-[#FAD99A] px-4 py-8 sm:px-8 sm:py-10 dark:border-[#FF4B4B] dark:bg-[#3d2f0a]">
        <div
          className="pointer-events-none absolute -bottom-2 right-0 -z-10 hidden aspect-square w-[120px] sm:block sm:w-[180px] md:w-[200px] lg:bottom-0 lg:w-[220px] xl:w-[300px]"
          aria-hidden
        >
          <IncorrectBear />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-center sm:gap-8">
          <div
            className={cn(
              "flex w-full min-w-0 flex-1 gap-0.5",
              shouldRenderCorrectAnswerAsImage
                ? "flex-col sm:flex-row sm:items-end sm:gap-10"
                : "flex-col",
            )}
          >
            <span className="text-xs font-black uppercase tracking-widest text-[#FF4B4B] dark:text-[#fecaca]">
              Correct answer
            </span>
            {shouldRenderCorrectAnswerAsImage ? (
              <img
                src={correctAnswer}
                alt="Correct answer"
                width={80}
                height={80}
                className="h-20 w-20 shrink-0 rounded-lg border border-[#F59E0B] object-cover dark:border-[#fbbf24]/60"
              />
            ) : (
              <span className="text-lg font-black text-black dark:text-[#fef3c7] sm:text-xl">
                {correctAnswer}
              </span>
            )}
          </div>

          <Button
            type="button"
            variant="sortbutton"
            size="sort"
            aria-pressed
            onClick={onContinue}
            className={cn(
              lessonSortBtn,
              "border-[#FF4B4B] bg-[#FF4B4B] text-white shadow-[0_4px_0_#991B1B] hover:brightness-105 active:scale-95",
              "aria-pressed:border-[#FF4B4B] aria-pressed:bg-[#FF4B4B] aria-pressed:text-white aria-pressed:shadow-[0_4px_0_#991B1B]",
              "dark:border-red-500 dark:bg-red-500 dark:shadow-[0_4px_0_#7f1d1d]",
              "dark:aria-pressed:border-red-500 dark:aria-pressed:bg-red-500 dark:aria-pressed:shadow-[0_4px_0_#7f1d1d]",
            )}
          >
            {mnUi.continue}
          </Button>
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
