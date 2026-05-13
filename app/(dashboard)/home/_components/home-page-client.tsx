// HomePath.tsx
"use client";

import { Montserrat } from "next/font/google";
const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

import LoadingScreen from "@/app/_components/loading-screen";
import Mascot from "./home-animation";
import { LessonCards, ROW, useLessons } from "./home-lesson-cards";
import { RoadPath } from "./home-road-path";

export const HomePath = () => {
  const { lessons, completedUpTo } = useLessons();

  const totalH = lessons.length * ROW + 80;

  return (
    <div
      className={`flex w-full justify-center px-3 py-8 sm:px-4 sm:py-10 md:px-6 ${montserrat.className}`}
    >
      <div className="relative w-full max-w-[340px]" style={{ height: totalH }}>
        <RoadPath lessonCount={lessons.length} completedUpTo={completedUpTo} />
        <LessonCards lessons={lessons} />
        <div className="fixed left-0 bottom-21.5 md:bottom-0 z-50 pointer-events-none">
          <div className="w-[120px] sm:w-[180px] md:w-[200px] lg:w-[220px] xl:w-[300px] aspect-square transition-all duration-300">
            <Mascot />
          </div>
        </div>
      </div>
    </div>
  );
};
