"use client";

import * as React from "react";

import { mnProfile } from "@/lib/i18n/mn-profile";
import type { ActivityHeatmapDay } from "../common/types";

type ActivityHeatmapProps = {
  days: ActivityHeatmapDay[];
};

const COLS = 26;
const ROWS = 7;
const ROW_LABELS = mnProfile.heatmapRowLabels;

// index 0 = empty, 1-6 = low → max
const COLORS: string[] = [
  "#F5F3EE",
  "#FAEEDA",
  "#FAC775",
  "#EF9F27",
  "#E8920A",
  "#BA7517",
  "#854F0B",
];

function addDaysUTC(date: Date, days: number) {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

function toISODateKeyUTC(date: Date) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatTooltipDateUTC(date: Date) {
  return date.toLocaleDateString("mn-MN", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function toLevel(value: number, maxValue: number): number {
  if (value <= 0 || maxValue <= 0) return 0;
  return Math.min(6, Math.max(1, Math.ceil((value / maxValue) * 6)));
}

export default function ActivityHeatmap({ days }: ActivityHeatmapProps) {
  const [tooltip, setTooltip] = React.useState<{
    visible: boolean;
    x: number;
    y: number;
    dateStr: string;
    valStr: string;
  }>({ visible: false, x: 0, y: 0, dateStr: "", valStr: "" });

  const showCellTooltip = React.useCallback(
    (e: React.MouseEvent, dateStr: string, valStr: string) => {
      setTooltip({
        visible: true,
        x: e.clientX + 14,
        y: e.clientY - 40,
        dateStr,
        valStr,
      });
    },
    [],
  );

  const hideTooltip = React.useCallback(() => {
    setTooltip((t) => ({ ...t, visible: false }));
  }, []);

  const { startDateUTC, lessonsByDate } = React.useMemo(() => {
    const endDateUTC = new Date();
    endDateUTC.setUTCHours(0, 0, 0, 0);
    const startDateUTC = addDaysUTC(endDateUTC, -(COLS * 7 - 1));

    const lessonsMap = new Map<string, number>();
    for (let i = 0; i < COLS * 7; i += 1) {
      lessonsMap.set(toISODateKeyUTC(addDaysUTC(startDateUTC, i)), 0);
    }

    for (const day of days) {
      if (lessonsMap.has(day.dateKey)) {
        lessonsMap.set(day.dateKey, Math.max(0, day.count));
      }
    }

    return { startDateUTC, lessonsByDate: lessonsMap };
  }, [days]);

  const monthLabels = React.useMemo(() => {
    const labels: string[] = [];
    let prevMonth = -1;

    for (let c = 0; c < COLS; c += 1) {
      const d = addDaysUTC(startDateUTC, c * 7);
      if (d.getUTCMonth() !== prevMonth) {
        labels.push(
          d.toLocaleString("mn-MN", { month: "short", timeZone: "UTC" }),
        );
        prevMonth = d.getUTCMonth();
      } else {
        labels.push("");
      }
    }

    return labels;
  }, [startDateUTC]);

  const grid = React.useMemo(() => {
    let maxValue = 0;
    for (const v of lessonsByDate.values()) {
      maxValue = Math.max(maxValue, v);
    }

    const rows: Array<
      Array<{ date: Date; dateKey: string; value: number; level: number }>
    > = Array.from({ length: ROWS }, () => []);

    for (let r = 0; r < ROWS; r += 1) {
      for (let c = 0; c < COLS; c += 1) {
        const date = addDaysUTC(startDateUTC, c * 7 + r);
        const dateKey = toISODateKeyUTC(date);
        const value = lessonsByDate.get(dateKey) ?? 0;
        rows[r].push({ date, dateKey, value, level: toLevel(value, maxValue) });
      }
    }

    return rows;
  }, [lessonsByDate, startDateUTC]);

  return (
    <div className="overflow-hidden rounded-2xl border-3 border-[#E8920A] bg-transparent p-3 shadow-[0_8px_24px_rgba(232,146,10,0.08)] dark:border-[#84d8ff]/40 dark:shadow-[0_8px_24px_rgba(132,216,255,0.12)]">
      <div className="hm-root">
        <div className="hm-grid-wrap">
          <div className="hm-grid-inner">
            <div className="hm-month-labels">
              {monthLabels.map((label, idx) => (
                <div className="month-label-item" key={`${label}-${idx}`}>
                  {label}
                </div>
              ))}
            </div>

            <div className="day-labels">
              <div />
              {Array.from({ length: COLS }, (_, i) => (
                <div key={i} />
              ))}
            </div>

            <div className="hm-rows">
              {grid.map((row, r) => (
                <div className="hm-row" key={r}>
                  <div className="row-label">
                    {[0, 2, 4].includes(r)
                      ? ROW_LABELS[[0, 2, 4].indexOf(r)]
                      : ""}
                  </div>
                  {row.map((cell) => {
                    const dateStr = formatTooltipDateUTC(cell.date);
                    const valStr =
                      cell.value > 0
                        ? mnProfile.heatmapLessons(cell.value)
                        : mnProfile.heatmapNoActivity;

                    return (
                      <div
                        key={cell.dateKey}
                        className="hm-cell"
                        style={{
                          background: COLORS[cell.level],
                          border:
                            cell.level === 0 ? "0.5px solid #E8E5DC" : "none",
                        }}
                        onMouseEnter={(e) => {
                          showCellTooltip(e, dateStr, valStr);
                        }}
                        onMouseLeave={hideTooltip}
                        role="img"
                        aria-label={`${dateStr}: ${valStr}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className="hm-tooltip"
          style={{
            opacity: tooltip.visible ? 1 : 0,
            left: tooltip.x,
            top: tooltip.y,
          }}
        >
          <div className="tt-date">{tooltip.dateStr}</div>
          <div className="tt-val">{tooltip.valStr}</div>
        </div>
      </div>

      <style jsx>{`
        .hm-root {
          --ma-amber: #e8920a;
          --ma-night: #1c2b4a;
          --text-muted: #7a7770;

          width: 100%;
        }

        @media (prefers-color-scheme: dark) {
          .hm-root {
            --text-muted: #8a8880;
          }
        }

        .hm-grid-wrap {
          overflow-x: auto;
          width: 100%;
        }

        .hm-grid-inner {
          width: 100%;
          min-width: 400px;
          background: transparent;
          border-radius: 12px;
          padding: 12px;
        }

        @media (prefers-color-scheme: dark) {
          .hm-grid-inner {
            background: transparent;
            border-color: rgba(132, 216, 255, 0.35);
          }
        }

        .hm-month-labels {
          display: flex;
          font-size: 10px;
          color: var(--text-muted);
          margin-bottom: 4px;
          padding-left: 28px;
        }

        .month-label-item {
          flex: 1;
          white-space: nowrap;
        }

        .day-labels {
          display: grid;
          grid-template-columns: 28px repeat(26, minmax(10px, 1fr));
          gap: 4px;
          margin-bottom: 2px;
        }

        .hm-rows {
          display: flex;
          flex-direction: column;
          gap: 4px;
          contain: content;
        }

        .hm-row {
          display: grid;
          grid-template-columns: 28px repeat(26, minmax(10px, 1fr));
          gap: 4px;
          align-items: stretch;
        }

        .row-label {
          font-size: 10px;
          color: var(--text-muted);
          text-align: right;
          padding-right: 6px;
        }

        .hm-cell {
          aspect-ratio: 1;
          width: 100%;
          min-height: 10px;
          border-radius: 6px;
          box-sizing: border-box;
          position: relative;
        }

        @media (hover: hover) {
          .hm-cell {
            cursor: pointer;
            transition: outline 0.1s ease;
          }

          .hm-cell:hover {
            outline: 2px solid var(--ma-amber);
            outline-offset: 1px;
            z-index: 2;
          }
        }

        .hm-tooltip {
          position: fixed;
          background: var(--ma-night);
          color: #fff;
          border-radius: 8px;
          padding: 7px 11px;
          font-size: 12px;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.15s;
          z-index: 100;
          white-space: nowrap;
        }

        .hm-tooltip .tt-date {
          font-size: 11px;
          opacity: 0.7;
          margin-bottom: 2px;
        }

        .hm-tooltip .tt-val {
          font-weight: 500;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}
