import { LessonContent } from "./lesson-types";

interface LessonContentCardProps {
  item: LessonContent;
  prompt?: string;
}

export function LessonContentCard({ item }: LessonContentCardProps) {
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex items-center gap-4">
        <div className="w-20 h-24 rounded-full bg-[#FAD99A] dark:bg-[#84d8ff26] flex items-center justify-center text-5xl shrink-0 border-3 border-[#E8920A] dark:border-[#84d8ff66]">
          🧑‍🦰
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="relative px-4 py-3 rounded-2xl bg-transparent border-3 border-[#E8920A]  dark:border-[#84d8ff66] dark:shadow-[0_8px_24px_rgba(132,216,255,0.12)] font-black text-xl">
            <span className="absolute -left-[9px] top-1/2 -translate-y-1/2 border-t-8 border-b-8 border-r-[10px] border-t-transparent border-b-transparent border-r-[#E8920A] dark:border-r-[#84d8ff66]" />
            {item.text}
          </div>
        </div>
      </div>
      {item.imageUrl && (
        <img
          src={item.imageUrl}
          alt=""
          width={100}
          height={100}
          className={`mt-2 rounded-xl max-w-full h-auto`}
        />
      )}
    </div>
  );
}
