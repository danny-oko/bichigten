import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ReadingStatus } from "../types/reading";

type ReadingTextCardProps = {
  canStart: boolean;
  durationSec: number;
  isRecording: boolean;
  isStarted: boolean;
  requiredAccuracy: number | null;
  secondsLeft: number;
  status: ReadingStatus;
  text: string;
  xpReward: number;
  wordsCount: number;
  onStart: () => void;
  onStop: () => void;
};

const MetadataChip = ({ label }: { label: string }) => (
  <span className="rounded-full border-2 border-[#E8920A]/35 bg-[#fff3dc] px-3 py-1 text-xs font-semibold text-amber-900">
    {label}
  </span>
);

export const ReadingTextCard = ({
  canStart,
  durationSec,
  isRecording,
  isStarted,
  requiredAccuracy,
  secondsLeft,
  status,
  text,
  xpReward,
  wordsCount,
  onStart,
  onStop,
}: ReadingTextCardProps) => {
  const mobileButtonText =
    status === "recording"
      ? "Болчихлоо!"
      : status === "transcribing"
        ? "Хөрвүүлж байна..."
        : status === "done"
          ? "Дахин унших"
          : "Эхлэх";
  const handleMobileButtonClick = isRecording ? onStop : onStart;

  return (
    <section className="relative flex h-[calc(100dvh-150px)] max-h-[760px] w-full max-w-full flex-col overflow-hidden rounded-2xl border-3 border-[#E8920A] bg-[#fff8ec] p-4 shadow-[0_14px_36px_rgba(232,146,10,0.12)] md:h-auto md:min-h-[320px] md:overflow-visible md:p-5 lg:h-[calc(100vh-220px)] lg:max-h-[680px] lg:min-h-[520px] dark:border-[#84d8ff]/40">
      <div className="absolute top-3 right-3 z-10 rounded-full border-2 border-[#E8920A]/30 bg-[#fff3dc]/95 px-3 py-1 text-sm font-bold tabular-nums text-amber-900 shadow-sm md:hidden">
        {secondsLeft}с
      </div>

      <div className="mb-3 pr-16 md:hidden">
        <p className="text-sm font-semibold text-amber-800">Уншлагын дасгал</p>
        <h2 className="mt-1.5 text-xl font-semibold text-stone-950">
          {isStarted ? "Уншиж байна..." : "Бэлэн үү?"}
        </h2>
        <p className="mt-2 text-sm leading-5 text-stone-600">
          {isStarted
            ? "Тогтуун хэмнэлээр, тод дуудаж уншаарай."
            : "Эхлэх дарсны дараа эх тодорч, 60 секундийн тоолуур эхэлнэ."}
        </p>
      </div>

      <div className="mb-3 hidden items-center justify-between gap-4 md:mb-4 md:flex">
        <h2 className="text-base font-semibold text-stone-950">Унших эх</h2>
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden lg:min-h-0">
        <p
          className={cn(
            "mongol-script h-full max-h-full max-w-full overflow-x-auto overflow-y-hidden whitespace-pre-wrap scroll-smooth pb-3 text-2xl leading-8 text-stone-800 transition-all duration-700 ease-out md:min-h-[260px] md:pb-4 md:leading-9 lg:h-full lg:overflow-auto",
            isStarted
              ? "text-stone-800 blur-0"
              : "select-none text-stone-500/60 blur-md opacity-60",
          )}
        >
          {text}
        </p>

        {!isStarted && (
          <div className="pointer-events-none absolute inset-0 hidden items-center justify-center px-6 md:flex">
            <div className="max-w-sm rounded-2xl border border-orange-300/70 bg-white/45 px-6 py-5 text-center shadow-lg backdrop-blur-md">
              <h3 className="text-xl font-black text-stone-900">Бэлэн үү?</h3>
              <p className="mt-2 text-sm font-medium text-stone-600">
                Бэлэн болсон үедээ Эхлэх товч дээр дараад уншлагаа эхлүүлээрэй.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 md:hidden">
        <Button
          type="button"
          onClick={handleMobileButtonClick}
          disabled={!canStart && !isRecording}
          className="h-12 w-full rounded-full bg-amber-600 px-6 text-base font-semibold text-white shadow-[0_10px_24px_rgba(217,119,6,0.22)] transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-stone-300 disabled:text-stone-500 disabled:shadow-none"
        >
          {mobileButtonText}
        </Button>
      </div>

      <div className="mt-4 hidden flex-wrap gap-2 border-t-2 border-[#E8920A]/15 pt-4 md:flex">
        <MetadataChip label={`${durationSec} Сек`} />
        <MetadataChip label={`${requiredAccuracy ?? 0}% Шаардлага`} />
        <MetadataChip label={`${xpReward} XP`} />
        <MetadataChip label={`${wordsCount} Үг`} />
      </div>
    </section>
  );
};
