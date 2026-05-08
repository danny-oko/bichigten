import "@fontsource/plus-jakarta-sans";

type HeaderProps = {
  heartsRemaining?: number;
  streak: number;
  totalXp: number;
  fixedOnDesktop?: boolean;
};

const MAX_HEARTS = 5;

export const Header = ({
  heartsRemaining = MAX_HEARTS,
  streak,
  totalXp,
  fixedOnDesktop = true,
}: HeaderProps) => {
  const safeHeartsRemaining = Math.max(
    0,
    Math.min(heartsRemaining, MAX_HEARTS),
  );
  const isOutOfHearts = safeHeartsRemaining === 0;
  const isStreakLost = streak === 0;

  return (
    <div
      className={[
        "w-full pt-[env(safe-area-inset-top)] font-['Plus_Jakarta_Sans']",
        fixedOnDesktop ? "md:fixed right-20 top-4 z-100" : "",
      ].join(" ")}
    >
      <div className="w-full">
        <div className="flex items-center px-4 py-3 font-['Plus_Jakarta_Sans'] text-[#0F5238]">
          <div className="flex shrink-0 items-center gap-10">
            <div
              className={`flex items-center gap-3 ${
                isOutOfHearts ? "text-[#A3A3A3]" : "text-[#FF4B4B]"
              }`}
            >
              {isOutOfHearts ? (
                <img
                  src="https://d35aaqx5ub95lt.cloudfront.net/images/hearts/2bd002fdb11664f869ead7bb84a2fc15.svg"
                  alt="Gray Heart Icon"
                  height={30}
                  width={30}
                />
              ) : (
                <img
                  src="https://d35aaqx5ub95lt.cloudfront.net/images/hearts/7631e3ee734dd4fe7792626b59457fa4.svg"
                  alt="Heart Icon"
                  height={30}
                  width={30}
                />
              )}
              <span className="text-md font-black sm:text-lg">
                {safeHeartsRemaining}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {isStreakLost ? (
                <img
                  src="https://d35aaqx5ub95lt.cloudfront.net/images/icons/65b8a029d7a148218f1ac98a198f8b42.svg"
                  alt="Flame Icon"
                  width={20}
                  height={20}
                />
              ) : (
                <img
                  src="https://d35aaqx5ub95lt.cloudfront.net/images/icons/398e4298a3b39ce566050e5c041949ef.svg"
                  alt="Flame Icon"
                  width={20}
                  height={20}
                />
              )}
              <span className="text-md font-black sm:text-lg">{streak}</span>
            </div>
            <div className="flex items-center gap-1">
              <img
                src="https://d35aaqx5ub95lt.cloudfront.net/images/goals/2b5a211d830a24fab92e291d50f65d1d.svg"
                alt="XP Icon"
                height={30}
                width={30}
              />
              <span className="text-md font-black sm:text-lg">
                {totalXp.toLocaleString()} XP
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
