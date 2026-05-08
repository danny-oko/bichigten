import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});
import { LessonContent } from "./lesson-types";

interface LessonContentCardProps {
  item: LessonContent;
  prompt?: string;
}

export function LessonContentCard({ item }: LessonContentCardProps) {
  return (
    <div className={`flex flex-col items-center gap-5 ${montserrat.className}`}>
      <div className="flex items-center gap-4">
        <div className="w-20 h-24 rounded-full bg-[#FAD99A] flex items-center justify-center text-5xl shrink-0">
          🧑‍🦰
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="relative px-4 py-3 rounded-2xl bg-[#EDE8DF] border-2 border-[#FAD99A] text-black font-black text-xl">
            <span className="absolute -left-[9px] top-1/2 -translate-y-1/2 border-t-8 border-b-8 border-r-[10px] border-t-transparent border-b-transparent border-r-[#FAD99A]" />
            {item.text}
          </div>
        </div>
      </div>
      {item.imageUrl && (
        <img
          src={item.imageUrl}
          alt=""
          width={300}
          height={300}
          className="mt-2 rounded-xl max-w-full h-auto antialiased"
        />
      )}
    </div>
  );
}
