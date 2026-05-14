import { cn } from "@/lib/utils";
import { BookOpenText } from "lucide-react";
import Link from "next/link";

type HomeSectionDividerProps = {
  className?: string;
  sectionLabel: string;
  title: string;
  toneIndex?: number;
};

const sectionTones = [
  {
    panel:
      "border-[#46a302] bg-[#58cc02] text-white shadow-[0_8px_20px_rgba(88,204,2,0.16)] dark:border-[#46a302] dark:bg-[#58cc02] dark:text-[#131f24]",
    label: "text-white/85 dark:text-[#131f24]/70",
    button:
      "border-[#46a302] bg-white/10 text-white hover:bg-white/20 dark:border-[#46a302] dark:bg-[#131f24]/10 dark:text-[#131f24] dark:hover:bg-[#131f24]/15",
  },
  {
    panel:
      "border-[#a855d8] bg-[#c678f2] text-white shadow-[0_8px_20px_rgba(166,85,216,0.16)] dark:border-[#a855d8] dark:bg-[#c678f2] dark:text-[#102024] dark:shadow-[0_8px_20px_rgba(22,193,209,0.14)]",
    label: "text-white/80 dark:text-[#102024]/70",
    button:
      "border-white/35 bg-white/15 text-white hover:bg-white/25 dark:border-[#102024]/20 dark:bg-[#102024]/10 dark:text-[#102024] dark:hover:bg-[#102024]/15",
  },
  {
    panel:
      "border-[#9b2c2c] bg-[#ef4444] text-white shadow-[0_8px_20px_rgba(155,44,44,0.18)] dark:border-[#b45309] dark:bg-[#f59e0b] dark:text-[#21160a] dark:shadow-[0_8px_20px_rgba(245,158,11,0.14)]",
    label: "text-white/80 dark:text-[#21160a]/70",
    button:
      "border-white/35 bg-white/15 text-white hover:bg-white/25 dark:border-[#21160a]/20 dark:bg-[#21160a]/10 dark:text-[#21160a] dark:hover:bg-[#21160a]/15",
  },
];

export const HomeSectionDivider = ({
  className,
  sectionLabel,
  title,
  toneIndex = 0,
}: HomeSectionDividerProps) => {
  const tone = sectionTones[Math.abs(toneIndex) % sectionTones.length];

  return (
    <section
      className={cn("relative w-full max-w-[520px] px-3 sm:px-4", className)}
      aria-labelledby="home-section-title"
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border-b-4 px-4 py-4 transition-colors duration-300 sm:px-5",
          tone.panel,
        )}
      >
        <div className="flex min-w-0 items-start justify-between gap-3">
          <div className="min-w-0 flex-1 pr-1">
            <p
              className={cn(
                "truncate text-[11px] font-black uppercase tracking-widest transition-colors duration-300",
                tone.label,
              )}
            >
              {sectionLabel}
            </p>
            <h1
              id="home-section-title"
              className="mt-1 text-[16px] font-black leading-snug wrap-break-word"
            >
              {title}
            </h1>
          </div>
          <Link
            href="/dictionary"
            className={cn(
              "mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-xl border-2 transition hover:bg-white/25 active:translate-y-px",
              tone.button,
            )}
            aria-label="Open guidebook"
          >
            <BookOpenText className="size-5" strokeWidth={3} />
          </Link>
        </div>
      </div>
    </section>
  );
};
