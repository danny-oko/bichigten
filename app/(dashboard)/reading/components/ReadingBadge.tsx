import type { ReactNode } from "react";

type ReadingBadgeProps = {
  children: ReactNode;
};

export const ReadingBadge = ({ children }: ReadingBadgeProps) => {
  return (
    <span className="w-fit rounded-full border border-amber-200 bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-amber-900">
      {children}
    </span>
  );
};
