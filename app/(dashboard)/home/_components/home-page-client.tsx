// HomePath.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Mascot from "./home-animation";
import {
  getLessonBaseY,
  getLessonsHeight,
  LessonCards,
  SECTION_GAP,
  useLessons,
} from "./home-lesson-cards";
import { RoadPath } from "./home-road-path";
import { HomeSectionDivider } from "./home-section-divider";

function getScrollRoot(start: HTMLElement | null): Window | HTMLElement {
  if (!start) return window;
  let el: HTMLElement | null = start;
  while (el) {
    const { overflowY } = getComputedStyle(el);
    if (
      overflowY === "auto" ||
      overflowY === "scroll" ||
      overflowY === "overlay"
    ) {
      return el;
    }
    el = el.parentElement;
  }
  return window;
}

function HomeSectionBreak({
  sectionIndex,
  title,
  top,
}: {
  sectionIndex: number;
  title: string;
  top: number;
}) {
  return (
    <div
      data-section-break-index={sectionIndex}
      className="pointer-events-none absolute left-1/2 z-20 flex w-[min(92vw,560px)] -translate-x-1/2 items-center gap-4 px-3"
      style={{ top }}
      aria-hidden="true"
    >
      <div className="h-0.5 min-w-0 flex-1 rounded-full bg-[#e5e5e5] dark:bg-[#37464f]" />
      <p className="max-w-[55%] truncate text-center text-lg font-black leading-none text-[#b8b8b8] dark:text-[#52606b]">
        {title}
      </p>
      <div className="h-0.5 min-w-0 flex-1 rounded-full bg-[#e5e5e5] dark:bg-[#37464f]" />
    </div>
  );
}

export const HomePath = () => {
  const { lessons, completedUpTo } = useLessons();
  const roadRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);

  const totalH = getLessonsHeight(lessons);
  const sections = useMemo(() => {
    return lessons.reduce<
      {
        levelId: string;
        order: number;
        title: string;
        startIndex: number;
        lessonCount: number;
        firstLessonOrder: number;
      }[]
    >((acc, lesson, index) => {
      const currentSection = acc[acc.length - 1];

      if (currentSection?.levelId === lesson.levelId) {
        currentSection.lessonCount += 1;
        return acc;
      }

      acc.push({
        levelId: lesson.levelId,
        order: lesson.level?.order ?? acc.length + 1,
        title: lesson.level?.title ?? "Монгол бичгийн үндэс",
        startIndex: index,
        lessonCount: 1,
        firstLessonOrder: lesson.order,
      });

      return acc;
    }, []);
  }, [lessons]);
  const activeSection = sections[activeSectionIndex] ?? sections[0];

  useEffect(() => {
    if (!sections.length) return;

    let frame = 0;

    const updateActiveSection = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const road = roadRef.current;
        if (!road) return;

        const dividerRect = dividerRef.current?.getBoundingClientRect();
        const switchLineY = dividerRect
          ? dividerRect.top + dividerRect.height / 2
          : 56;
        const sectionBreaks = road.querySelectorAll<HTMLElement>(
          "[data-section-break-index]",
        );

        const nextSectionIndex = Array.from(sectionBreaks).reduce(
          (activeIndex, sectionBreak) => {
            const sectionIndex = Number(
              sectionBreak.dataset.sectionBreakIndex,
            );
            const breakRect = sectionBreak.getBoundingClientRect();
            const breakMiddleY = breakRect.top + breakRect.height / 2;

            return breakMiddleY <= switchLineY ? sectionIndex : activeIndex;
          },
          0,
        );

        setActiveSectionIndex((currentSectionIndex) =>
          currentSectionIndex === nextSectionIndex
            ? currentSectionIndex
            : nextSectionIndex,
        );
      });
    };

    updateActiveSection();

    const scrollRoot = getScrollRoot(
      roadRef.current ?? dividerRef.current,
    );
    const scrollOptions = { passive: true } as const;
    scrollRoot.addEventListener("scroll", updateActiveSection, scrollOptions);
    window.addEventListener("resize", updateActiveSection);

    return () => {
      cancelAnimationFrame(frame);
      scrollRoot.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [lessons, sections]);

  return (
    <div className="flex w-full flex-col items-center px-3 py-8 sm:px-4 sm:py-10 md:px-6">
      {activeSection ? (
        <div ref={dividerRef} className="sticky top-3 z-40 mb-8 w-full">
          <HomeSectionDivider
            className="mx-auto"
            sectionLabel={`Section ${activeSection.order}, Unit ${activeSection.firstLessonOrder}`}
            title={activeSection.title}
            toneIndex={activeSection.order - 1}
          />
        </div>
      ) : null}
      <div
        ref={roadRef}
        className="relative w-full max-w-[340px]"
        style={{ height: totalH }}
      >
        {sections
          .filter((section) => section.startIndex > 0)
          .map((section) => (
            <HomeSectionBreak
              key={section.levelId}
              sectionIndex={sections.indexOf(section)}
              title={section.title}
              top={
                getLessonBaseY(lessons, section.startIndex) - SECTION_GAP / 2
              }
            />
          ))}
        <RoadPath lessons={lessons} completedUpTo={completedUpTo} />
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
