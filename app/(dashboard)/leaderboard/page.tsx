import prisma from "@/lib/prisma";
import { MainLayout } from "@/components/layout/MainLayout";
import { fetchLeaderboardTop100Cached } from "@/lib/server/leaderboard-data";
import { getRankNameFromXp } from "@/lib/utils/getRankNameFromXp";
import { auth } from "@clerk/nextjs/server"; // Import Clerk auth
import WebLeaguePath from "./_components/LeagueProgression";
import WebNearbyPlayers from "./_components/SocialPeersList";
import WebLeaderboardList from "./_components/WebLeaderboardList";
import WebPodiumSection from "./_components/WebPodiumSection";

export default async function RankPage() {
  const { userId } = await auth();

  /** Indexed ORDER BY + short cache — avoids full-table sort on every navigation. */
  const dbUsers = await fetchLeaderboardTop100Cached();

  let currentUser: { totalXp: number } | null = null;
  if (userId) {
    const inTop = dbUsers.find((u) => u.id === userId);
    if (inTop) {
      currentUser = { totalXp: inTop.totalXp };
    } else {
      try {
        currentUser = await prisma.user.findUnique({
          where: { id: userId },
          select: { totalXp: true },
        });
      } catch {
        currentUser = null;
      }
    }
  }

  const allUsers = dbUsers.map((user, index) => ({
    id: user.id,
    rank: index + 1,
    name: user.userName || user.name || "Anonymous",
    xp: user.totalXp,
    title: getRankNameFromXp(user.totalXp),
    avatarUrl: user.avatarUrl || null,
    isMe: user.id === userId,
  }));

  const podiumUsers = allUsers.slice(0, 3);
  const listUsers = allUsers.slice(3);

  return (
    <div className="min-h-screen bg-[#FFF8E7] pb-24 text-[#3b2f2f] md:pb-10">
      <MainLayout
        aside={
          <>
            <WebNearbyPlayers
              players={allUsers.slice(0, 5).map((u) => ({ ...u, xpChange: 0 }))}
            />
            <WebLeaguePath userXp={currentUser?.totalXp || 0} />
          </>
        }
      >
        <div className="space-y-4 md:space-y-5">
            {podiumUsers.length >= 3 ? (
              <WebPodiumSection users={podiumUsers} />
            ) : (
              <div className="p-10 text-center bg-white rounded-2xl border border-dashed border-[#E8D9C0]">
                Лиг эхлэхэд илүү олон тоглогч хэрэгтэй...
              </div>
            )}
            <WebLeaderboardList users={listUsers} />
        </div>
      </MainLayout>
    </div>
  );
}
