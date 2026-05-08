"use client";

import * as React from "react";
import type { ActivityHeatmapDay } from "../common/types";

type ActivityHeatmapProps = {
  days: ActivityHeatmapDay[];
};

const COLS = 26;
const ROWS = 7;
const DAYS: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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
  return date.toLocaleDateString("en-US", {
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
          d.toLocaleString("default", { month: "short", timeZone: "UTC" }),
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

    const rows: Array<Array<{ date: Date; dateKey: string; value: number; level: number }>> =
      Array.from({ length: ROWS }, () => []);

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
    <>
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
                  <div className="row-label">{[0, 2, 4].includes(r) ? DAYS[r] : ""}</div>
                  {row.map((cell) => {
                    const dateStr = formatTooltipDateUTC(cell.date);
                    const valStr =
                      cell.value > 0
                        ? `${cell.value} lesson${cell.value === 1 ? "" : "s"}`
                        : "No activity";

                    return (
                      <div
                        key={cell.dateKey}
                        className="hm-cell"
                        style={{
                          background: COLORS[cell.level],
                          border: cell.level === 0 ? "0.5px solid #E8E5DC" : "none",
                        }}
                        onMouseMove={(e) => {
                          setTooltip({
                            visible: true,
                            x: e.clientX + 14,
                            y: e.clientY - 40,
                            dateStr,
                            valStr,
                          });
                        }}
                        onMouseLeave={() =>
                          setTooltip((t) => ({ ...t, visible: false }))
                        }
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
          min-width: 0;
          background: rgba(245, 243, 238, 0.7);
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 12px;
          padding: 12px;
        }

        @media (prefers-color-scheme: dark) {
          .hm-grid-inner {
            background: rgba(255, 255, 255, 0.04);
            border-color: rgba(255, 255, 255, 0.08);
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
          grid-template-columns: 28px repeat(26, minmax(0, 1fr));
          gap: 3px;
          margin-bottom: 2px;
        }

        .hm-rows {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .hm-row {
          display: grid;
          grid-template-columns: 28px repeat(26, minmax(0, 1fr));
          gap: 3px;
          align-items: center;
        }

        .row-label {
          font-size: 10px;
          color: var(--text-muted);
          text-align: right;
          padding-right: 6px;
        }

        .hm-cell {
          aspect-ratio: 1;
          border-radius: 3px;
          cursor: pointer;
          transition: transform 0.1s, outline 0.1s;
          position: relative;
        }

        .hm-cell:hover {
          transform: scale(1.25);
          z-index: 10;
          outline: 2px solid var(--ma-amber);
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
    </>
  );
}
