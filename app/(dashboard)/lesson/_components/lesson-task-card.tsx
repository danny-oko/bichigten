import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { Task } from "./lesson-types";

interface LessonTaskCardProps {
  task: Task;
}

const difficultyShell = {
  EASY: "border-emerald-800/40 bg-emerald-950/90 text-emerald-400",
  MEDIUM: "border-amber-900/50 bg-amber-950/90 text-amber-200",
  HARD: "border-red-950/60 bg-red-950/90 text-red-300",
} as const;

export function LessonTaskCard({ task }: LessonTaskCardProps) {
  const diffClass = difficultyShell[task.difficulty];

  return (
    <div className="flex flex-col gap-3 rounded-2xl  bg-transparent p-4  sm:p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={cn(
            buttonVariants({ variant: "sortbutton", size: "sort" }),
            "pointer-events-none border-2 font-black uppercase tracking-widest",
            diffClass,
          )}
        >
          {task.difficulty}
        </span>
        <span
          className={cn(
            buttonVariants({ variant: "sortbutton", size: "sort" }),
            "pointer-events-none border-[#ead9bb] text-[10px] font-black tracking-widest text-muted-foreground dark:border-[#37464f]",
          )}
        >
          +{task.xpReward} XP
        </span>
      </div>
      <Separator className="bg-[#ead9bb] dark:bg-[#37464f]" />
      <h2 className="text-xl font-black text-foreground sm:text-2xl">
        {task.question}
      </h2>
    </div>
  );
}
