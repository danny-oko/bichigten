import { mnUi } from "@/lib/i18n/mn-ui";
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
      <div className="w-full px-4 sm:px-8 py-8 sm:py-10 border-t-4 border-[#FF4B4B] bg-[#FAD99A]">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
          <div
            className={`flex w-full flex-1 gap-0.5 ${shouldRenderCorrectAnswerAsImage ? "flex gap-10" : "flex-col"}`}
          >
            <span className="text-xs font-black tracking-widest uppercase text-[#FF4B4B]">
              Correct answer
            </span>
            {shouldRenderCorrectAnswerAsImage ? (
              <img
                src={correctAnswer}
                alt="Correct answer"
                width={80}
                height={80}
                className="h-20 w-20 rounded-lg object-cover border border-[#F59E0B]"
              />
            ) : (
              <span className="text-lg font-black text-black">
                {correctAnswer}
              </span>
            )}
          </div>

          <div className="absolute right-55 bottom-15 -z-10 hidden w-[120px] sm:w-[180px] md:w-[200px] lg:w-[220px] xl:w-[300px] xl:block aspect-square transition-all duration-300">
            <IncorrectBear />
          </div>
          <button
            onClick={onContinue}
            className="w-full sm:w-[300px] py-3.5 px-7 rounded-2xl font-black text-sm tracking-widest uppercase text-white active:scale-95 transition-all"
            style={{ background: "#FF4B4B", boxShadow: "0 4px 0 #991B1B" }}
          >
            {mnUi.continue}
          </button>
        </div>
      </div>
    );
  }

  if (isTeaching) {
    return (
      <div className="w-full px-4 sm:px-8 py-8 sm:py-10">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-end gap-4">
          <button
            onClick={onClick}
            className="w-full sm:w-[300px] py-3.5 px-20 rounded-2xl font-black text-sm tracking-widest uppercase text-white active:scale-95 transition-all"
            style={{ background: "#E8920A", boxShadow: "0 4px 10px #E8920A" }}
          >
            {mnUi.gotIt}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-8 py-8 sm:py-10">
      <div className="mx-auto flex w-full max-w-5xl gap-4 items-center justify-between">
        <button
          onClick={onSkip}
          className="w-full sm:w-[300px] py-3.5 px-6 rounded-2xl font-black text-sm tracking-widest uppercase border-2 border-[#374151] text-[#6B7280] hover:border-[#4B5563] hover:text-[#9CA3AF] transition-colors"
        >
          {mnUi.skip}
        </button>
        <button
          onClick={onClick}
          disabled={disabled}
          className="w-full sm:w-[300px] py-3.5 px-7 rounded-2xl font-black text-sm tracking-widest uppercase transition-all active:scale-95"
          style={{
            background: disabled ? "#473108" : "#E8920A",
            boxShadow: disabled ? "0 4px 0 #473108" : "0 4px 10px #E8920A",
            cursor: disabled ? "not-allowed" : "pointer",
            color: disabled ? "#6B7280" : "#FFFFFF",
          }}
        >
          {mnUi.check}
        </button>
      </div>
    </div>
  );
}
