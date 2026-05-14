"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartContainer } from "@/components/ui/chart";
import { mnProfile } from "@/lib/i18n/mn-profile";

const EXAM_CHART_DATA = [
  { period: "2025", participants: 83374, belowThreshold: 12964 },
  { period: "2026 хавар", participants: 87000, belowThreshold: 8700 },
];

const fillParticipants = "var(--chart-3)";
const fillBelow = "var(--chart-1)";

export function HelpRootCauseCharts() {
  return (
    <div className="mt-5 w-full min-w-0">
      <p className="mb-1 text-xs font-semibold text-[#5c5346] dark:text-[#cbd5e1]">
        {mnProfile.helpChartExamTitle}
      </p>
      <ChartContainer className="rounded-lg border border-[#ead9bb]/80 bg-[#fffdf7]/40 p-1 dark:border-[#37464f] dark:bg-[#0f172a]/30">
        <BarChart
          data={EXAM_CHART_DATA}
          margin={{ top: 8, right: 4, left: 0, bottom: 28 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="period" tick={{ fontSize: 10 }} interval={0} height={36} />
          <YAxis
            tick={{ fontSize: 9 }}
            tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : String(v))}
            width={32}
          />
          <Tooltip
            cursor={{ fill: "var(--muted)", opacity: 0.25 }}
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid var(--border)",
              fontSize: "12px",
              background: "var(--popover)",
              maxWidth: "min(280px, 90vw)",
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: "10px", width: "100%" }}
            verticalAlign="bottom"
            height={28}
          />
          <Bar
            dataKey="participants"
            name={mnProfile.helpChartLegendParticipants}
            fill={fillParticipants}
            radius={[4, 4, 0, 0]}
            maxBarSize={36}
            opacity={0.85}
          />
          <Bar
            dataKey="belowThreshold"
            name={mnProfile.helpChartLegendBelow}
            fill={fillBelow}
            radius={[4, 4, 0, 0]}
            maxBarSize={36}
            opacity={0.65}
          />
        </BarChart>
      </ChartContainer>
      <p className="mt-1.5 text-[0.65rem] leading-relaxed text-[#8a806f] dark:text-[#94a3b8]">
        {mnProfile.helpChartExamCaption}
      </p>
    </div>
  );
}
