"use client";

import { useEffect, useRef } from "react";

interface StrokeAnimationProps {
  path: string;
  play: boolean;
  viewBox?: string;
  width?: number;
  height?: number;
}

export default function StrokeAnimation({
  path,
  play,
  viewBox = "0 0 21 49",
  width = 63,
  height = 147,
}: StrokeAnimationProps) {
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const paths = path.split("|");

  useEffect(() => {
    if (!play) return;

    const elements = pathRefs.current.filter(Boolean) as SVGPathElement[];
    const totalDuration = 2500; // давтах хугацаа (ms)

    const runAnimation = () => {
      // Бүх path-г reset
      elements.forEach((el) => {
        const len = el.getTotalLength();
        el.style.transition = "none";
        el.style.strokeDasharray = `${len}`;
        el.style.strokeDashoffset = `${len}`;
      });

      // 2 frame дараа зурах
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          elements.forEach((el, i) => {
            const len = el.getTotalLength();
            const delay = i * 0.8;
            el.style.transition = `stroke-dashoffset 1s cubic-bezier(0.47, 0, 0.745, 0.715) ${delay}s`;
            el.style.strokeDashoffset = "0";
          });
        });
      });
    };

    runAnimation();
    const interval = setInterval(runAnimation, totalDuration);

    return () => clearInterval(interval);
  }, [play, path]);

  return (
    <svg
      width={width}
      height={height}
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {paths.map((d, i) => (
        <path
          key={i}
          ref={(el) => {
            pathRefs.current[i] = el;
          }}
          d={d}
          stroke="#3b2f2f"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}
