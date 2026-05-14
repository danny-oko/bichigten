/** Prisma `Date` fields may arrive as ISO strings after `unstable_cache` serialization. */
export type StreakInstant = Date | string | number;

function parseInstant(value: StreakInstant): Date {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) {
    throw new TypeError(`toUtcDateOnly: invalid date ${String(value)}`);
  }
  return d;
}

export function toUtcDateOnly(value: StreakInstant): Date {
  const d = parseInstant(value);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

export function calculateDailyStreak(completedAt: StreakInstant[]) {
  const uniqueDays = Array.from(new Set(completedAt.map((d) => toUtcDateOnly(d).getTime()))).sort(
    (a, b) => b - a,
  );
  if (!uniqueDays.length) return 0;

  const oneDayMs = 24 * 60 * 60 * 1000;
  const today = toUtcDateOnly(new Date()).getTime();
  const yesterday = today - oneDayMs;
  if (uniqueDays[0] !== today && uniqueDays[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < uniqueDays.length; i += 1) {
    if (uniqueDays[i - 1] - uniqueDays[i] !== oneDayMs) break;
    streak += 1;
  }

  return streak;
}

/** Longest run of consecutive UTC days with at least one completion. */
export function bestStreakFromCompletionDates(completedAt: StreakInstant[]) {
  const uniqueDays = Array.from(new Set(completedAt.map((d) => toUtcDateOnly(d).getTime()))).sort(
    (a, b) => a - b,
  );
  if (!uniqueDays.length) return 0;

  const oneDayMs = 24 * 60 * 60 * 1000;
  let best = 1;
  let cur = 1;
  for (let i = 1; i < uniqueDays.length; i += 1) {
    if (uniqueDays[i] - uniqueDays[i - 1] === oneDayMs) {
      cur += 1;
      best = Math.max(best, cur);
    } else {
      cur = 1;
    }
  }
  return best;
}
