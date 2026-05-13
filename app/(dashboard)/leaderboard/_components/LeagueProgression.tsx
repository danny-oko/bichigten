// Inside LeagueProgression.tsx
export default function WebLeaguePath({ userXp = 0 }: { userXp: number }) {
  // We use your RANK_TIERS directly here
  const RANK_TIERS = [
    { minXp: 0, label: "Начин", icon: "🦅" },
    { minXp: 350, label: "Харцага", icon: "🦅" },
    { minXp: 560, label: "Заан", icon: "🐘" },
    { minXp: 1000, label: "Гарьд", icon: "🦅" },
    { minXp: 1560, label: "Арслан", icon: "🦁" },
    { minXp: 1920, label: "Аварга", icon: "🏆" },
    { minXp: 2550, label: "Даян Аварга", icon: "🔥" },
    { minXp: 3700, label: "Дархан Аварга", icon: "👑" },
  ];

  const getStatus = (tierXp: number, index: number) => {
    const nextTier = RANK_TIERS[index + 1];
    if (userXp >= (nextTier?.minXp ?? Infinity)) return "done";
    if (userXp >= tierXp) return "current";
    return "locked";
  };

  return (
    <div className="rounded-2xl border-3 border-[#E8920A] bg-transparent p-5 shadow-[0_8px_24px_rgba(232,146,10,0.08)] dark:border-[#84d8ff]/40 dark:shadow-[0_8px_24px_rgba(132,216,255,0.12)]">
      <h3 className="mb-5 border-b border-[#ead9bb] px-1 pb-3 text-sm font-bold text-[#E8920A] dark:border-[#84d8ff]/30 dark:text-[#84d8ff]">
        Цолны нэршил
      </h3>

      <div className="space-y-1">
        {RANK_TIERS.map((rank, index) => {
          const status = getStatus(rank.minXp, index);
          const isCurrent = status === "current";
          const isLocked = status === "locked";

          return (
            <div
              key={rank.label}
              className="relative flex items-center gap-3 p-2 group"
            >
              {index !== RANK_TIERS.length - 1 && (
                <div className="absolute left-[23px] top-10 h-6 w-px bg-[#ead9bb] dark:bg-[#37464f]" />
              )}

              <div
                className={`z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all ${
                  isCurrent
                    ? "scale-110 border-[#E8920A] bg-[#E8920A]/15 dark:border-[#84d8ff] dark:bg-[#84d8ff]/15"
                    : isLocked
                      ? "border-[#ead9bb] bg-[#E9E3D8]/50 grayscale dark:border-[#37464f] dark:bg-[#252f35]/50"
                      : "border-[#E8920A]/35 bg-[#E8920A]/10 dark:border-[#84d8ff]/40 dark:bg-[#84d8ff]/10"
                }`}
              >
                <span className="text-sm">{isLocked ? "🔒" : rank.icon}</span>
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className={`wrap-break-word text-xs font-bold ${isLocked ? "text-[#7a5930]/60 dark:text-[#52606b]" : "text-[#3b2f2f] dark:text-[#d8d2c4]"}`}
                >
                  {rank.label}
                </p>
                {isCurrent && (
                  <p className="text-[10px] font-medium text-[#E8920A] dark:text-[#84d8ff]">
                    Дараагийн цол хүртэл {RANK_TIERS[index + 1]?.minXp - userXp}{" "}
                    XP
                  </p>
                )}
              </div>

              {status === "done" && (
                <span className="text-[10px] font-bold text-[#E8920A] dark:text-[#84d8ff]">
                  ✓
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
