import Link from "next/link";

import { SidebarWidget } from "@/components/layout/SidebarWidget";
import { mnProfile } from "@/lib/i18n/mn-profile";
import { mnUi } from "@/lib/i18n/mn-ui";

type LessonProgressCardProps = {
  completedLessons: number;
  totalLessons: number;
  nextLessonHref: string;
  nextLessonTitle: string;
};

export default function LessonProgressCard({
  completedLessons,
  totalLessons,
  nextLessonHref,
  nextLessonTitle,
}: LessonProgressCardProps) {
  const progress =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <SidebarWidget
      title={mnProfile.lessonCardTitle}
      subtitle={mnProfile.lessonCardSubtitle(completedLessons, totalLessons)}
    >
      <div className="space-y-4">
        <div className="h-2 rounded-full bg-[#E9E3D8] dark:bg-[#252f35]">
          <div
            className="h-2 rounded-full bg-[#E8920A] dark:bg-[#ffad33]"
            style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
          />
        </div>
        <p className="text-sm text-[#3e382d] dark:text-[#bdb5a6]">
          {mnProfile.nextLesson}:{" "}
          <span className="font-bold text-[#1C2B4A] dark:text-[#cbd5e1]">
            {nextLessonTitle}
          </span>
        </p>
        <Link
          href={nextLessonHref}
          className="inline-flex w-full items-center justify-center rounded-xl bg-[#1C2B4A] px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-[#193766]"
        >
          {mnUi.continueLearning}
        </Link>
      </div>
    </SidebarWidget>
  );
}
