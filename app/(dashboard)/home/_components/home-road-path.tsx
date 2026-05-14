// RoadPath.tsx
"use client";

import {
  type Lesson,
  getLessonBaseY,
  getLessonXPercent,
  getLessonsHeight,
  SW,
} from "./home-lesson-cards";

function buildPath(pts: { x: number; y: number }[]) {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1],
      b = pts[i];
    const dy = b.y - a.y;
    const dx = b.x - a.x;
    const side = i % 2 === 0 ? -1 : 1;
    const bow = Math.max(42, Math.min(82, Math.abs(dy) * 0.42));
    const c1x = a.x + dx * 0.25 + side * bow;
    const c2x = b.x - dx * 0.25 + side * bow;
    const c1y = a.y + dy * 0.38;
    const c2y = b.y - dy * 0.38;

    d += ` C ${c1x} ${c1y} ${c2x} ${c2y} ${b.x} ${b.y}`;
  }
  return d;
}

export const RoadPath = ({
  lessons,
  completedUpTo,
}: {
  lessons: Lesson[];
  completedUpTo: number;
}) => {
  const lessonCount = lessons.length;

  if (lessonCount < 2) return null;

  const pts = Array.from({ length: lessonCount }, (_, i) => ({
    x: (getLessonXPercent(lessons, i) / 100) * SW,
    y: getLessonBaseY(lessons, i) + 74,
    levelId: lessons[i]?.levelId,
    index: i,
  }));

  const groups = pts.reduce<(typeof pts)[]>((acc, point) => {
    const currentGroup = acc[acc.length - 1];

    if (!currentGroup || currentGroup[0]?.levelId !== point.levelId) {
      acc.push([point]);
    } else {
      currentGroup.push(point);
    }

    return acc;
  }, []);

  const totalH = getLessonsHeight(lessons);

  return (
    <svg
      viewBox={`0 0 ${SW} ${totalH}`}
      preserveAspectRatio="none"
      className="absolute inset-0 w-full pointer-events-none"
      style={{ height: totalH }}
    >
      {groups.map((group) => {
        const fullPath = buildPath(group);
        const donePath = buildPath(
          group.filter((point) => point.index <= completedUpTo),
        );

        return (
          <g key={`${group[0]?.levelId ?? "section"}-${group[0]?.index ?? 0}`}>
            {fullPath && (
              <path
                d={fullPath}
                stroke="#BFC9C1"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="10 8"
              />
            )}
            {donePath && (
              <path
                d={donePath}
                stroke="#0F5238"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="10 8"
              />
            )}
          </g>
        );
      })}
    </svg>
  );
};
