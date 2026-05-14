import type { StreakDayDot } from "@/app/(dashboard)/profile/common/types";
import { buildLast7StreakDots } from "@/lib/server/build-profile-user";
import { StreakNavHover } from "./StreakNavHover";

type HeaderProps = {
  heartsRemaining?: number;
  streak: number;
  streakWeekDays?: StreakDayDot[];
  totalXp: number;
  fixedOnDesktop?: boolean;
};

const MAX_HEARTS = 5;

export const Header = ({
  heartsRemaining = MAX_HEARTS,
  streak,
  streakWeekDays,
  totalXp,
  fixedOnDesktop = true,
}: HeaderProps) => {
  const safeHeartsRemaining = Math.max(
    0,
    Math.min(heartsRemaining, MAX_HEARTS),
  );
  const isOutOfHearts = safeHeartsRemaining === 0;

  const statText = "text-sm font-black tabular-nums sm:text-base lg:text-lg";
  const statIcon =
    "h-7 w-7 shrink-0 object-contain sm:h-[30px] sm:w-[30px]";

  return (
    <div
      className={[
        "w-full pt-[env(safe-area-inset-top)]",
        fixedOnDesktop
          ? "md:fixed md:right-4 md:top-3 md:z-100 lg:right-12 xl:right-20"
          : "",
      ].join(" ")}
    >
      <div className="w-full min-w-0">
        <div
          className={[
            "flex w-full min-w-0 flex-row flex-nowrap items-center justify-between gap-x-2 py-2 sm:py-2.5 md:justify-start md:gap-x-5 md:py-3 lg:gap-x-8 xl:gap-x-10",
            fixedOnDesktop
              ? "px-3 sm:px-4"
              : "px-3 sm:px-4 md:px-[calc(1.25rem+3px)]",
          ].join(" ")}
        >
          <div
            className={`flex shrink-0 items-center gap-2 sm:gap-3 ${
              isOutOfHearts ? "text-[#A3A3A3]" : "text-[#FF4B4B]"
            }`}
          >
            {isOutOfHearts ? (
              <img
                src="https://d35aaqx5ub95lt.cloudfront.net/images/hearts/2bd002fdb11664f869ead7bb84a2fc15.svg"
                alt="Gray Heart Icon"
                className={statIcon}
                height={30}
                width={30}
              />
            ) : (
              <img
                src="https://d35aaqx5ub95lt.cloudfront.net/images/hearts/7631e3ee734dd4fe7792626b59457fa4.svg"
                alt="Heart Icon"
                className={statIcon}
                height={30}
                width={30}
              />
            )}
            <span
              className={[statText, isOutOfHearts ? "text-slate-500" : "text-red-500"].join(
                " ",
              )}
            >
              {safeHeartsRemaining}
            </span>
          </div>
          <div className="shrink-0">
            <StreakNavHover
              streak={streak}
              streakWeekDays={streakWeekDays ?? buildLast7StreakDots(new Set())}
            />
          </div>
          <div className="flex min-w-0 max-w-full shrink items-center gap-2 sm:gap-3 md:max-w-none md:basis-0 md:grow md:justify-end">
            <img
              src="https://d35aaqx5ub95lt.cloudfront.net/images/goals/2b5a211d830a24fab92e291d50f65d1d.svg"
              alt="XP Icon"
              className={statIcon}
              height={30}
              width={30}
            />
            <span
              className={`min-w-0 max-md:truncate md:text-right md:whitespace-nowrap ${statText}`}
            >
              {totalXp.toLocaleString()} XP
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
