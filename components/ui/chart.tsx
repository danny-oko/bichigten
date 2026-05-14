"use client";

import * as React from "react";
import { ResponsiveContainer } from "recharts";

import { cn } from "@/lib/utils";

/**
 * Minimal chart shell aligned with shadcn/recharts patterns: responsive box + themed axis/grid ticks.
 */
function ChartContainer({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      data-slot="chart"
      className={cn(
        "w-full min-w-0 max-w-full overflow-hidden text-[0.7rem] [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line]:stroke-border/45 [&_.recharts-legend-item-text]:fill-muted-foreground [&_.recharts-legend-wrapper]:max-w-full",
        "h-[min(220px,max(160px,32vw))] sm:h-[200px] md:h-[220px]",
        className,
      )}
    >
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}

export { ChartContainer };
