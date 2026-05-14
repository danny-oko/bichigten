import { cn } from "@/lib/utils";

import { LessonContent } from "./lesson-types";

interface LessonContentCardProps {
  item: LessonContent;
}

export function LessonContentCard({ item }: LessonContentCardProps) {
  const unicode = item.unicode?.trim() ?? "";
  const showUnicode = unicode.length > 0;

  return (
    <section
      className={cn(
        "mx-auto flex w-full max-w-3xl flex-col gap-5",
        showUnicode && "md:flex-row md:items-stretch md:gap-6 lg:gap-8",
      )}
    >
      {showUnicode ? (
        <div
          className={cn(
            "flex shrink-0 items-center justify-center rounded-2xl border-3 border-[#E8920A]",
            "bg-transparent ",
            "shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]",
            "dark:border-[#84d8ff]/45  dark:shadow-none",
            "mx-auto min-h-44 w-full max-w-[16rem] px-3 py-6 md:mx-0 md:h-auto md:min-h-72 md:w-40 md:max-w-none lg:w-44",
          )}
          aria-label="Traditional Mongolian script"
        >
          <span
            className={cn(
              "mongol-script select-none text-center text-[clamp(2.25rem,6vw,3.25rem)] font-normal leading-none",
              "text-[#1C2B4A] dark:text-[#cbd5e1]",
            )}
          >
            {unicode}
          </span>
        </div>
      ) : null}

      <article
        className={cn(
          "relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border-3 border-[#E8920A]",
          "shadow-[0_14px_44px_rgba(122,89,48,0.12)] bg-transparent",
          "dark:border-[#84d8ff]/45 dark:shadow-[0_14px_44px_rgba(0,0,0,0.28)]",
        )}
      >
        {item.imageUrl ? (
          <div className="relative max-h-56 w-full shrink-0 overflow-hidden border-b border-[#ead9bb] bg-[#f0e6d4] dark:border-[#37464f] dark:bg-[#252f35] sm:max-h-72">
            <img
              src={item.imageUrl}
              alt={
                item.name ? `${item.name} illustration` : "Lesson illustration"
              }
              className="h-full w-full max-h-56 object-cover object-center sm:max-h-72"
              loading="lazy"
              decoding="async"
            />
          </div>
        ) : null}

        <div
          className={cn(
            "flex flex-col gap-3 px-5 py-5 sm:gap-4 sm:px-7 sm:py-7",
            !item.imageUrl && "pt-6 sm:pt-8",
          )}
        >
          {item.name ? (
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#b0892c] dark:text-[#94a3b8]">
              {item.name}
            </p>
          ) : null}

          <p
            className={cn(
              "font-balsamiq text-pretty text-lg font-semibold leading-relaxed tracking-tight text-[#2a2319]",
              "sm:text-xl sm:leading-relaxed",
              "dark:text-[#e8e4dc]",
            )}
          >
            {item.text}
          </p>
        </div>
      </article>
    </section>
  );
}
