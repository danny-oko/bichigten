interface WebStandingCardProps {
  league: string;
  rank: number;
  total: number;
  promotionPercent: number;
  xpToPromote: number;
}

export default function WebStandingCard({
  league,
  rank,
  total,
  promotionPercent,
  xpToPromote,
}: WebStandingCardProps) {
  return (
    <div className="bg-[#1B2A4A] rounded-2xl p-5 text-white">
      <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">
        Таны байр
      </p>

      <div className="inline-flex items-center gap-1.5 bg-[#2A3F6A] px-3 py-1 rounded-full mb-4">
        <span className="text-sm">⭐</span>
        <span className="text-sm font-medium text-gray-200">{league}</span>
      </div>

      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-5xl font-bold text-white">#{rank}</span>
        <span className="text-lg text-gray-400">of {total}</span>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-400 mb-1.5">
          <span>Gold Steppe багт дэвших</span>
          <span className="text-[#E8940A] font-semibold">
            {promotionPercent}%
          </span>
        </div>
        <div className="w-full bg-[#2A3F6A] rounded-full h-2">
          <div
            className="bg-[#E8940A] h-2 rounded-full"
            style={{ width: `${promotionPercent}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1.5">
          {xpToPromote} Gold league-ийг нээхийн тулд илүү их XP хэрэгтэй
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-[#2A3F6A] flex justify-between text-xs text-gray-400">
        <span>🟢 Top 5 = Promote</span>
        <span>🔴 Bottom 3 = Demote</span>
      </div>
    </div>
  );
}
