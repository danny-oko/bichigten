import { cn } from "@/lib/utils";

type ReadingTextCardProps = {
  text: string;
  isStarted: boolean;
  durationSec: number;
  requiredAccuracy: number | null;
  xpReward: number;
  wordsCount: number;
};

const MetadataChip = ({ label }: { label: string }) => (
  <span className="rounded-full border-2 border-[#E8920A]/35 bg-[#fff3dc] px-3 py-1 text-xs font-semibold text-amber-900">
    {label}
  </span>
);

export const ReadingTextCard = ({
  text,
  isStarted,
  durationSec,
  requiredAccuracy,
  xpReward,
  wordsCount,
}: ReadingTextCardProps) => {
  return (
    <section className="flex max-h-[55vh] min-h-[320px] w-full max-w-full flex-col rounded-2xl border-3 border-[#E8920A] bg-[#fff8ec] p-4 shadow-[0_14px_36px_rgba(232,146,10,0.12)] md:p-5 lg:h-[calc(100vh-220px)] lg:max-h-[680px] lg:min-h-[520px] dark:border-[#84d8ff]/40">
      <div className="mb-3 flex items-center justify-between gap-4 md:mb-4">
        <h2 className="text-base font-semibold text-stone-950">Унших эх</h2>
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden">
        <p
          className={cn(
            "mongol-script h-full overflow-y-auto whitespace-pre-wrap scroll-smooth text-2xl leading-9 transition-all duration-700 ease-out",
            isStarted
              ? "text-stone-800 blur-0"
              : "select-none text-stone-500/60 blur-md opacity-60",
          )}
        >
          {text}
        </p>

        {!isStarted && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
            <div className="max-w-sm rounded-2xl border border-orange-300/70 bg-white/45 px-6 py-5 text-center shadow-lg backdrop-blur-md">
              <h3 className="text-xl font-black text-stone-900">Бэлэн үү?</h3>
              <p className="mt-2 text-sm font-medium text-stone-600">
                Бэлэн болсон үедээ Эхлэх товч дээр дараад уншлагаа эхлүүлээрэй.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2 border-t-2 border-[#E8920A]/15 pt-4">
        <MetadataChip label={`${durationSec} Сек`} />
        <MetadataChip label={`${requiredAccuracy ?? 0}% Шаардлага`} />
        <MetadataChip label={`${xpReward} XP`} />
        <MetadataChip label={`${wordsCount} Үг`} />
      </div>
    </section>
  );
};
