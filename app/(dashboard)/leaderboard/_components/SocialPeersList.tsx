interface NearbyPlayer {
  id: string;
  rank: number;
  name: string;
  xp: number;
  xpChange: number;
  avatarUrl: string | null; // Change 'undefined' to 'null' here
  isMe: boolean;
}

interface WebNearbyPlayersProps {
  players: NearbyPlayer[];
}

export default function WebNearbyPlayers({ players }: WebNearbyPlayersProps) {
  return (
    <div className="rounded-2xl border-3 border-[#E8920A] bg-transparent p-5 dark:border-[#84d8ff]/40">
      <div className="mb-4 flex items-center justify-between border-b border-[#ead9bb] pb-3 dark:border-[#37464f]">
        <p className="text-xs uppercase tracking-wide text-[#7a5930] dark:text-[#94a3b8]">
          Сурагчид
        </p>
        <p className="text-xs text-[#7a5930] dark:text-[#94a3b8]">Ranks 1-5</p>
      </div>

      <p className="mb-3 text-sm font-semibold text-[#3b2f2f] dark:text-[#d8d2c4]">
        Та аль түвшинд байна?
      </p>

      <div className="flex flex-col gap-2">
        {players.map((player) => (
          <div
            key={player.id}
            className={`flex items-center gap-3 rounded-xl px-3 py-2 ${
              player.isMe
                ? "bg-[#E8920A]/10 dark:bg-[#84d8ff]/10"
                : ""
            }`}
          >
            <span className="w-4 shrink-0 text-sm font-semibold text-[#7a5930] dark:text-[#94a3b8]">
              {player.rank}
            </span>

            <div
              className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-sm font-bold ${
                player.isMe
                  ? "bg-[#E8920A] text-white dark:bg-[#84d8ff] dark:text-[#131f24]"
                  : "bg-[#D3C4A8] text-[#7a6a50] dark:bg-[#37464f] dark:text-[#9ba3a7]"
              }`}
            >
              {player.avatarUrl ? (
                <img
                  src={player.avatarUrl}
                  alt={player.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                player.name[0]
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-sm font-semibold text-[#3b2f2f] dark:text-[#d8d2c4]">
                  {player.name}
                </p>
                {player.isMe && (
                  <span className="rounded-full bg-[#1C2B4A] dark:bg-[#2e4575] px-1.5 py-0.5 text-[9px] font-bold text-white">
                    Та
                  </span>
                )}
              </div>
            </div>

            <div className="text-right shrink-0">
              <p className="text-sm font-bold text-[#E8920A] dark:text-[#84d8ff]">
                {player.xp.toLocaleString()}
              </p>
              {player.xpChange !== undefined && (
                <p
                  className={`text-[10px] font-medium ${player.xpChange >= 0 ? "text-[#2E8B6F] dark:text-[#4ade80]" : "text-[#D63F3F] dark:text-[#f87171]"}`}
                >
                  {player.xpChange >= 0 ? "+" : ""}
                  {player.xpChange} XP
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
