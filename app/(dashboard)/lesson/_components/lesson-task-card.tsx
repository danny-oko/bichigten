import { Montserrat } from "next/font/google";
import { Task } from "./lesson-types";

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

interface LessonTaskCardProps {
  task: Task;
}

export function LessonTaskCard({ task }: LessonTaskCardProps) {
  return (
    <div className={`flex flex-col gap-3 ${montserrat.className}`}>
      <div className="flex items-center gap-2">
        <span
          className="text-[10px] font-black tracking-widest uppercase px-2 py-1 rounded-full"
          style={{
            background:
              task.difficulty === "EASY"
                ? "#14532D"
                : task.difficulty === "MEDIUM"
                  ? "#713F12"
                  : "#450A0A",
            color:
              task.difficulty === "EASY"
                ? "#4ADE80"
                : task.difficulty === "MEDIUM"
                  ? "#FDE047"
                  : "#F87171",
          }}
        >
          {task.difficulty}
        </span>
        <span className="text-[10px] font-black tracking-widest uppercase text-[#6B7280]">
          +{task.xpReward} XP
        </span>
      </div>
      <h2 className="text-xl sm:text-2xl font-black text-black">
        {task.question}
      </h2>
    </div>
  );
}
