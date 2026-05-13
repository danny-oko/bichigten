import type { ReactNode } from "react";

type ReadingBadgeProps = {
  children: ReactNode;
};

export const ReadingBadge = ({ children }: ReadingBadgeProps) => {
  return (
    <span className="w-fit rounded-full border-3 border-[#E8920A]/60 bg-transparent px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-amber-900 dark:border-[#84d8ff]/50 dark:text-[#e8e4dc]">
      {children}
    </span>
  );
};
