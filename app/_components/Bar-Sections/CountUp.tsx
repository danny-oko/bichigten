"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type CountUpProps = {
  from?: number;
  to: number;
  separator?: string;
  direction?: "up" | "down";
  duration?: number;
  className?: string;
  delay?: number;
  suffix?: string;
};

function formatValue(value: number, separator?: string) {
  const rounded = Math.round(value);
  if (!separator) {
    return String(rounded);
  }
  return rounded.toLocaleString("en-US").replace(/,/g, separator);
}

export default function CountUp({
  from = 0,
  to,
  separator,
  direction = "up",
  duration = 1,
  className,
  delay = 0,
  suffix = "",
}: CountUpProps) {
  const [display, setDisplay] = useState(from);
  const settledRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const start = settledRef.current ?? from;
    const end = to;

    startTimeRef.current = null;

    const timeoutId = window.setTimeout(() => {
      const step = (timestamp: number) => {
        if (startTimeRef.current === null) {
          startTimeRef.current = timestamp;
        }

        const elapsed = (timestamp - startTimeRef.current) / 1000;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - (1 - progress) ** 3;
        const current = start + (end - start) * eased;

        setDisplay(current);

        if (progress < 1) {
          frameRef.current = requestAnimationFrame(step);
        } else {
          setDisplay(end);
          settledRef.current = end;
        }
      };

      setDisplay(start);
      frameRef.current = requestAnimationFrame(step);
    }, delay * 1000);

    return () => {
      window.clearTimeout(timeoutId);
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [to, from, duration, delay]);

  return (
    <span className={cn(className)}>
      {formatValue(display, separator)}
      {suffix}
    </span>
  );
}
