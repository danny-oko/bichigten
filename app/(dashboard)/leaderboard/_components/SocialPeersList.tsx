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
    <div className="rounded-2xl border-3 border-[#E8920A] p-5 bg-transparent dark:border-[#37464f]">
      <div className="mb-4 flex items-center justify-between border-b border-[#ECE7DE] dark:border-[#37464f] pb-3">
        <p className="text-xs uppercase tracking-wide text-[#3b352c] dark:text-[#bfc6ca]">
          Ойролцоох тоглогчид
        </p>
        <p className="text-xs text-[#39342c] dark:text-[#8997a0]">Ranks 1-3</p>
      </div>

      <p className="mb-3 text-sm font-semibold text-[#0f182c] dark:text-[#f0f4f5]">
        Таны эргэн тойронд
      </p>

      <div className="flex flex-col gap-2">
        {players.map((player) => (
          <div
            key={player.rank}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl ${
              player.isMe ? "bg-[#ecd6b8] dark:bg-[#37464f]" : ""
            }`}
          >
            <span className="text-sm font-semibold text-[#888] w-4 shrink-0 dark:text-[#9ba3a7]">
              {player.rank}
            </span>

            <div
              className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-sm font-bold ${
                player.isMe
                  ? "bg-[#E8920A] text-white dark:bg-[#ffad33] dark:text-[#131f24]"
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
                <p className="text-sm font-semibold text-[#222] truncate dark:text-[#f0f4f5]">
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
              <p className="text-sm font-bold text-[#222] dark:text-[#f0f4f5]">
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
