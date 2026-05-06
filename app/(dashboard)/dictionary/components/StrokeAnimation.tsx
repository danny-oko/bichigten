// "use client";

// import { useEffect, useRef, useState } from "react";

// export default function StrokeAnimation({
//   path,
//   play,
// }: {
//   path: string;
//   play: boolean;
// }) {
//   const pathRef = useRef<SVGPathElement | null>(null);
//   const [length, setLength] = useState(0);

//   // Path length calculate
//   useEffect(() => {
//     if (pathRef.current) {
//       const totalLength = pathRef.current.getTotalLength();
//       setLength(totalLength);
//     }
//   }, [path]);

//   // Play trigger
//   useEffect(() => {
//     if (!pathRef.current) return;

//     const el = pathRef.current;

//     if (play) {
//       el.style.transition = "none";
//       el.style.strokeDashoffset = `${length}`;

//       // force repaint
//       el.getBoundingClientRect();

//       el.style.transition =
//         "stroke-dashoffset 2s cubic-bezier(0.47,0,0.745,0.715)";
//       el.style.strokeDashoffset = "0";
//     }
//   }, [play, length]);

//   return (
//     <svg
//       viewBox="0 0 40 50"
//       className="h-full w-full"
//       fill="none"
//       stroke="#003D27"
//       strokeWidth={2}
//       strokeLinecap="round"
//     >
//       <path
//         ref={pathRef}
//         d={path}
//         strokeDasharray={length}
//         strokeDashoffset={length}
//       />
//     </svg>
//   );
// }

"use client";

import { useEffect, useRef } from "react";

interface StrokeAnimationProps {
  path: string;
  play: boolean;
}

export default function StrokeAnimation({ path, play }: StrokeAnimationProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    if (play) {
      // active класс нэмэх → stroke-dashoffset: 0 болно → зурагдана
      svgRef.current.classList.add("active");
    } else {
      // reset хийх
      svgRef.current.classList.remove("active");
    }
  }, [play]);

  return (
    <>
      <style>{`
        svg .svg-elem-1 {
          stroke-dashoffset: 88.7438px;
          stroke-dasharray: 88.7438px;
          transition: stroke-dashoffset 1s cubic-bezier(0.47, 0, 0.745, 0.715) 0s;
        }
        svg.active .svg-elem-1 {
          stroke-dashoffset: 0;
        }
      `}</style>

      <svg
        ref={svgRef}
        width="21"
        height="49"
        viewBox="0 0 21 49"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="svg-elem-1"
          d={path}
          stroke="#3b2f2f"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </>
  );
}
