"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Field, FieldLabel } from "@/components/ui/field";
import { mnLabels, mnSignUp } from "@/lib/i18n/mn-copy";

type AgeSignUpProps = {
  value: string;
  onChange: (value: string) => void;
};

const SWIPE_PX = 48;

export function AgeSignUp({ value, onChange }: AgeSignUpProps) {
  const pointerIdRef = useRef<number | null>(null);
  const startXRef = useRef(0);

  const selectedAge = Number(value) > 0 ? Number(value) : 24;

  const clampAge = (n: number) => Math.max(1, Math.min(100, n));
  const setAge = (n: number) => onChange(String(clampAge(n)));

  const prevAge = clampAge(selectedAge - 1);
  const nextAge = clampAge(selectedAge + 1);

  const bump = (delta: number) => setAge(selectedAge + delta);

  const onPointerDown = (e: React.PointerEvent) => {
    pointerIdRef.current = e.pointerId;
    startXRef.current = e.clientX;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (pointerIdRef.current !== e.pointerId) return;
    pointerIdRef.current = null;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    const dx = e.clientX - startXRef.current;
    if (dx > SWIPE_PX) bump(-1);
    else if (dx < -SWIPE_PX) bump(1);
  };

  return (
    <div className="animate-in slide-in-from-bottom-3 fade-in-0 space-y-3 duration-300 sm:space-y-4">
      <h1 className="text-2xl font-bold tracking-tight text-amber-950 sm:text-3xl">
        {mnSignUp.ageTitle}
      </h1>
      <Field>
        <FieldLabel
          htmlFor="age-display"
          className="text-sm font-semibold tracking-wide text-[#E8920A]"
        >
          {mnLabels.age}
        </FieldLabel>
        <div
          className="mx-auto flex w-full max-w-md items-center gap-0.5 sm:gap-1"
          role="group"
          aria-label={mnSignUp.agePickerAria}
        >
          <button
            type="button"
            aria-label={mnSignUp.decreaseAgeAria}
            disabled={selectedAge <= 1}
            onClick={() => bump(-1)}
            className="flex shrink-0 items-center justify-center rounded-full border-0 bg-transparent p-1.5 text-amber-800/80 transition-colors hover:bg-amber-200/35 hover:text-amber-950 active:scale-95 disabled:pointer-events-none disabled:opacity-35"
          >
            <ChevronLeft className="size-5 sm:size-[1.35rem]" strokeWidth={2.25} />
          </button>

          <div
            id="age-display"
            role="spinbutton"
            aria-valuemin={1}
            aria-valuemax={100}
            aria-valuenow={selectedAge}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown" || e.key === "ArrowLeft") bump(-1);
              if (e.key === "ArrowUp" || e.key === "ArrowRight") bump(1);
            }}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={() => {
              pointerIdRef.current = null;
            }}
            className="relative flex min-h-[7rem] min-w-0 flex-1 cursor-grab touch-none select-none flex-col items-center justify-center rounded-[24px] border border-amber-200 bg-[#F8F4E3] px-2 py-4 shadow-inner shadow-amber-900/5 active:cursor-grabbing sm:min-h-[8rem] sm:rounded-[28px] sm:px-4 sm:py-6"
          >
            <div className="grid w-full grid-cols-3 items-center gap-0.5 sm:gap-2">
              <button
                type="button"
                className="text-center text-3xl font-medium tabular-nums text-amber-900/45 transition-colors hover:text-amber-800 sm:text-4xl"
                onClick={() => setAge(prevAge)}
              >
                {prevAge}
              </button>
              <div
                key={selectedAge}
                className="animate-in fade-in zoom-in-95 duration-200"
              >
                <span className="block text-center text-5xl font-bold tabular-nums text-[#E8920A] sm:text-7xl">
                  {selectedAge}
                </span>
              </div>
              <button
                type="button"
                className="text-center text-3xl font-medium tabular-nums text-amber-900/45 transition-colors hover:text-amber-800 sm:text-4xl"
                onClick={() => setAge(nextAge)}
              >
                {nextAge}
              </button>
            </div>
          </div>

          <button
            type="button"
            aria-label={mnSignUp.increaseAgeAria}
            disabled={selectedAge >= 100}
            onClick={() => bump(1)}
            className="flex shrink-0 items-center justify-center rounded-full border-0 bg-transparent p-1.5 text-amber-800/80 transition-colors hover:bg-amber-200/35 hover:text-amber-950 active:scale-95 disabled:pointer-events-none disabled:opacity-35"
          >
            <ChevronRight className="size-5 sm:size-[1.35rem]" strokeWidth={2.25} />
          </button>
        </div>
      </Field>
    </div>
  );
}
