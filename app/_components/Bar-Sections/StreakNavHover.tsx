"use client";

import { useSyncExternalStore } from "react";
import { Check, Flame } from "lucide-react";
import { HoverCard } from "radix-ui";

import type { StreakDayDot } from "@/app/(dashboard)/profile/common/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { mnProfile } from "@/lib/i18n/mn-profile";

function subscribePointerCoarse(onChange: () => void) {
  const mq = window.matchMedia("(pointer: coarse)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getPointerCoarseSnapshot() {
  return window.matchMedia("(pointer: coarse)").matches;
}

function getPointerCoarseServerSnapshot() {
  return false;
}

function StreakCardBody({
  streak,
  streakWeekDays,
}: {
  streak: number;
  streakWeekDays: StreakDayDot[];
}) {
  return (
    <div className="p-4 sm:p-5">
      <div className="flex gap-4">
        <div className="flex shrink-0 items-center gap-1">
          <div className="relative flex h-22 w-22 items-center justify-center">
            <Flame
              className="absolute size-18 text-[#E5A13D]"
              aria-hidden
              fill="currentColor"
              stroke="#C8872E"
              strokeWidth={0.6}
            />
          </div>
          {streak > 0 ? (
            <span className="text-2xl font-black tracking-tight text-[#c77a0a] tabular-nums">
              {streak}
            </span>
          ) : null}
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <p className="text-lg font-bold leading-tight text-[#3b2f2f]">
            {mnProfile.streakTitle}
          </p>
          <p className="mt-1.5 text-sm leading-snug text-[#706552]">
            {mnProfile.streakHoverSubtitle}
          </p>
        </div>
      </div>

      <div className="mt-5 border-t border-[#ead9bb]/70 pt-4">
        <div className="flex justify-between gap-1">
          {streakWeekDays.map((day, i) => (
            <div
              key={`${day.label}-${i}`}
              className="flex min-w-0 flex-1 flex-col items-center gap-1.5"
            >
              <span className="text-[10px] font-semibold uppercase tracking-wide text-[#8a806f]">
                {day.label}
              </span>
              <div
                className={[
                  "flex size-8 items-center justify-center rounded-full sm:size-9",
                  day.completed
                    ? "bg-[#E8920A] text-white shadow-sm"
                    : "bg-[#e5dfd0] text-white/90",
                ].join(" ")}
              >
                <Check className="size-4 stroke-[2.5]" aria-hidden />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StreakTriggerFace({
  streak,
  isStreakLost,
  className,
}: {
  streak: number;
  isStreakLost: boolean;
  className?: string;
}) {
  return (
    <span
      className={[
        "inline-flex cursor-default items-center gap-3 outline-none select-none",
        className ?? "",
      ].join(" ")}
    >
      {isStreakLost ? (
        <img
          src="https://d35aaqx5ub95lt.cloudfront.net/images/icons/ba95e6081679d9d7e8c132da5cfce1ec.svg"
          alt=""
          width={20}
          height={20}
        />
      ) : (
        <img
          src="https://d35aaqx5ub95lt.cloudfront.net/images/icons/398e4298a3b39ce566050e5c041949ef.svg"
          alt=""
          width={20}
          height={20}
        />
      )}
      <span
        className={[
          "text-md font-black tabular-nums sm:text-lg",
          isStreakLost
            ? "text-muted-foreground"
            : "text-[#c77a0a] dark:text-amber-300",
        ].join(" ")}
      >
        {streak}
      </span>
    </span>
  );
}

type StreakNavHoverProps = {
  streak: number;
  streakWeekDays: StreakDayDot[];
};

export function StreakNavHover({
  streak,
  streakWeekDays,
}: StreakNavHoverProps) {
  const isStreakLost = streak === 0;
  const prefersCoarsePointer = useSyncExternalStore(
    subscribePointerCoarse,
    getPointerCoarseSnapshot,
    getPointerCoarseServerSnapshot,
  );

  if (prefersCoarsePointer) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <button
            type="button"
            className="inline-flex rounded-lg p-0.5 text-foreground transition-opacity hover:opacity-90 active:opacity-80"
            aria-label={mnProfile.streakTitle}
          >
            <StreakTriggerFace streak={streak} isStreakLost={isStreakLost} />
          </button>
        </DialogTrigger>
        <DialogContent
          showCloseButton
          className="max-w-[min(380px,calc(100vw-2rem))] gap-0 rounded-2xl border-[#ead9bb] bg-[#fffdf8] p-0 text-[#3b2f2f] shadow-xl sm:rounded-2xl"
        >
          <DialogHeader className="sr-only">
            <DialogTitle>{mnProfile.streakTitle}</DialogTitle>
          </DialogHeader>
          <StreakCardBody streak={streak} streakWeekDays={streakWeekDays} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <HoverCard.Root openDelay={180} closeDelay={100}>
      <HoverCard.Trigger
        href="#"
        className="inline-flex rounded-lg p-0.5 text-foreground no-underline outline-none focus-visible:ring-2 focus-visible:ring-[#E8920A]/50"
        onClick={(e) => {
          e.preventDefault();
        }}
        aria-label={mnProfile.streakTitle}
      >
        <StreakTriggerFace streak={streak} isStreakLost={isStreakLost} />
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content
          side="bottom"
          align="center"
          sideOffset={10}
          collisionPadding={16}
          className="z-200 w-[min(360px,calc(100vw-24px))] origin-(--radix-hover-card-content-transform-origin) rounded-2xl border border-[#ead9bb] bg-[#fffdf8] text-[#3b2f2f] shadow-xl outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
        >
          <HoverCard.Arrow className="fill-[#fffdf8]" width={14} height={7} />
          <StreakCardBody streak={streak} streakWeekDays={streakWeekDays} />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}
