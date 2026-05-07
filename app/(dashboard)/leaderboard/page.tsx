import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server"; // Import Clerk auth
import { getRankNameFromXp } from "@/lib/utils/getRankNameFromXp";
import WebPodiumSection from "./_components/WebPodiumSection";
import WebLeaderboardList from "./_components/WebLeaderboardList";
import WebNearbyPlayers from "./_components/SocialPeersList";
import WebLeaguePath from "./_components/LeagueProgression";

export default async function RankPage() {
  // 1. Get the userId from Clerk Auth
  const { userId } = await auth();

  // 2. Fetch data: Leaderboard and the Current User's XP
  const [dbUsers, currentUser] = await Promise.all([
    prisma.user.findMany({
      orderBy: { totalXp: "desc" },
      select: {
        id: true,
        name: true,
        userName: true,
        totalXp: true,
        avatarUrl: true,
      },
      take: 100,
    }),
    userId
      ? prisma.user.findUnique({
          where: { id: userId },
          select: { totalXp: true },
        })
      : null,
  ]);

  const allUsers = dbUsers.map((user, index) => ({
    id: user.id,
    rank: index + 1,
    name: user.userName || user.name || "Anonymous",
    xp: user.totalXp,
    title: getRankNameFromXp(user.totalXp),
    avatarUrl: user.avatarUrl || null,
    isMe: user.id === userId, // Now we accurately know which row is "Me"
  }));

  const podiumUsers = allUsers.slice(0, 3);
  const listUsers = allUsers.slice(3);

  return (
    <div className="min-h-screen bg-[#FFF8E7] pb-24 text-[#3b2f2f] md:pb-10">
      <div className="mx-auto hidden w-full max-w-[1220px] px-4 pt-5 md:block md:px-6 md:pt-8">
        <div className="grid w-full gap-4 md:grid-cols-[minmax(0,1fr)_320px] md:gap-5">
          <main className="min-w-0 space-y-4 md:space-y-5">
            {podiumUsers.length >= 3 ? (
              <WebPodiumSection users={podiumUsers} />
            ) : (
              <div className="p-10 text-center bg-white rounded-2xl border border-dashed border-[#E8D9C0]">
                Лиг эхлэхэд илүү олон тоглогч хэрэгтэй...
              </div>
            )}
            <WebLeaderboardList users={listUsers} />
          </main>

          <aside className="min-w-0 space-y-4 md:space-y-5">
            <WebNearbyPlayers
              players={allUsers.slice(0, 5).map((u) => ({ ...u, xpChange: 0 }))}
            />

            {/* 3. Pass the actual XP from Prisma to your new clean League Path */}
            <WebLeaguePath userXp={currentUser?.totalXp || 0} />
          </aside>
        </div>
      </div>
    </div>
  );
}
