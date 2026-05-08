import Image from "next/image";
import { X } from "lucide-react";

interface LessonTopBarProps {
  progress: number;
  hearts: number;
  onBack: () => void;
}

export function LessonTopBar({ progress, hearts, onBack }: LessonTopBarProps) {
  return (
    <div className="w-full px-4 sm:px-8 pt-5 pb-3">
      <div className="mx-auto flex w-full max-w-5xl items-center gap-4">
        <button
          onClick={onBack}
          className="text-[#4B5563] hover:text-[#9CA3AF] transition-colors"
        >
          <X className="w-6 h-6" strokeWidth={2.5} />
        </button>
        <div className="flex-1 h-4 rounded-full overflow-hidden bg-[#ECE8D8]">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${Math.max(progress, 2)}%`,
              background: "#E8930A",
            }}
          />
        </div>
        <div className="flex items-center gap-1.5">
          <Image
            src="https://d35aaqx5ub95lt.cloudfront.net/images/hearts/7631e3ee734dd4fe7792626b59457fa4.svg"
            alt="Heart Icon"
            height={30}
            width={30}
          />
          <span className="font-black text-base text-[#FF4B4B]">{hearts}</span>
        </div>
      </div>
    </div>
  );
}

//
