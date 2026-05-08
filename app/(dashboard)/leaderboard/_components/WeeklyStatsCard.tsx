interface WebThisWeekCardProps {
  totalXp: number;
  xpChange: number;
  dayStreak: number;
  isPersonalBest: boolean;
  xpToday: number;
  isAboveAvg: boolean;
  daysActive: number;
  totalDays: number;
  isGoodPace: boolean;
}

export default function WebThisWeekCard({
  totalXp,
  xpChange,
  dayStreak,
  isPersonalBest,
  xpToday,
  isAboveAvg,
  daysActive,
  totalDays,
  isGoodPace,
}: WebThisWeekCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#E8D9C0] p-5">
      <p className="text-xs text-[#999] uppercase tracking-wide mb-4">
        Энэ 7 хоног
      </p>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-2xl font-bold text-[#E8940A]">
            {totalXp.toLocaleString()}
          </p>
          <p className="text-xs text-[#999] mt-0.5">Total XP</p>
          <p className="text-[10px] text-green-500 mt-0.5">
            ▲ +{xpChange} Өнгөрсөн долоо хоногтой харьцуулахад
          </p>
        </div>

        <div>
          <p className="text-2xl font-bold text-[#222]">{dayStreak}</p>
          <p className="text-xs text-[#999] mt-0.5">Өдрийн цуваа</p>
          {isPersonalBest && (
            <p className="text-[10px] text-[#E8940A] mt-0.5">
              🏆 Personal best!
            </p>
          )}
        </div>

        <div>
          <p className="text-2xl font-bold text-[#222]">{xpToday}</p>
          <p className="text-xs text-[#999] mt-0.5">Өнөөдрийн XP</p>
          {isAboveAvg && (
            <p className="text-[10px] text-green-500 mt-0.5">
              ▲ Дундажаас дээгүүр
            </p>
          )}
        </div>

        <div>
          <p className="text-2xl font-bold text-[#222]">
            {daysActive}
            <span className="text-sm text-[#999] font-normal">
              /{totalDays}
            </span>
          </p>
          <p className="text-xs text-[#999] mt-0.5">Идэвхтэй өдрүүд</p>
          {isGoodPace && (
            <p className="text-[10px] text-green-500 mt-0.5">✓ Сайн хэмнэл</p>
          )}
        </div>
      </div>
    </div>
  );
}
