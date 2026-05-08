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
    <div className="rounded-2xl border-2 border-[#E5E5E5] bg-white p-5">
      <div className="mb-4 flex items-center justify-between border-b border-[#ECE7DE] pb-3">
        <p className="text-xs uppercase tracking-wide text-[#6F6658]">
          Ойролцоох тоглогчид
        </p>
        <p className="text-xs text-[#6F6658]">Ranks 1-3</p>
      </div>

      <p className="mb-3 text-sm font-semibold text-[#1C2B4A]">
        Таны эргэн тойронд
      </p>

      <div className="flex flex-col gap-2">
        {players.map((player) => (
          <div
            key={player.rank}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl ${
              player.isMe ? "bg-[#FFF8EE]" : ""
            }`}
          >
            <span className="text-sm font-semibold text-[#888] w-4 shrink-0">
              {player.rank}
            </span>

            <div
              className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-sm font-bold ${
                player.isMe
                  ? "bg-[#E8920A] text-white"
                  : "bg-[#D3C4A8] text-[#7a6a50]"
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
                <p className="text-sm font-semibold text-[#222] truncate">
                  {player.name}
                </p>
                {player.isMe && (
                  <span className="rounded-full bg-[#1C2B4A] px-1.5 py-0.5 text-[9px] font-bold text-white">
                    Та
                  </span>
                )}
              </div>
            </div>

            <div className="text-right shrink-0">
              <p className="text-sm font-bold text-[#222]">
                {player.xp.toLocaleString()}
              </p>
              {player.xpChange !== undefined && (
                <p
                  className={`text-[10px] font-medium ${player.xpChange >= 0 ? "text-[#2E8B6F]" : "text-[#D63F3F]"}`}
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
