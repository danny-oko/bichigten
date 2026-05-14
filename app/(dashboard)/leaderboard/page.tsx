import { MainLayout } from "@/components/layout/MainLayout";
import {
  fetchLeaderboardTop100Cached,
  fetchUserTotalXpCached,
} from "@/lib/server/leaderboard-data";
import { mapUsersToNearbyPlayers } from "@/lib/server/nearby-players";
import { getRankNameFromXp } from "@/lib/utils/getRankNameFromXp";
import { auth } from "@clerk/nextjs/server";
import WebLeaguePath from "./_components/LeagueProgression";
import WebNearbyPlayers from "./_components/SocialPeersList";
import WebLeaderboardList from "./_components/WebLeaderboardList";
import WebPodiumSection from "./_components/WebPodiumSection";

export default async function RankPage() {
  const { userId } = await auth();

  const dbUsers = await fetchLeaderboardTop100Cached();

  let currentUser: { totalXp: number } | null = null;
  if (userId) {
    const inTop = dbUsers.find((u) => u.id === userId);
    if (inTop) {
      currentUser = { totalXp: inTop.totalXp };
    } else {
      try {
        const row = await fetchUserTotalXpCached(userId);
        currentUser = row ? { totalXp: row.totalXp } : null;
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
  const nearbySidebarPlayers = mapUsersToNearbyPlayers(
    userId,
    dbUsers.slice(0, 5),
  );

  return (
    <div className="min-h-screen bg-transparent pb-24 font-balsamiq text-[#3b2f2f] dark:text-[#9ba3a7] md:pb-10">
      <MainLayout
        aside={
          <div className="space-y-4">
            <WebNearbyPlayers players={nearbySidebarPlayers} />
            <WebLeaguePath userXp={currentUser?.totalXp || 0} />
          </div>
        }
      >
        <div className="space-y-4 md:space-y-5">
          <header>
            <h1 className="text-2xl font-bold tracking-tight text-[#E8920A] dark:text-[#84d8ff] sm:text-3xl md:text-4xl">
              Онооны Самбар
            </h1>
            <p className="mt-1 text-xs font-bold text-[#7a5930] dark:text-[#bfb8a9] sm:text-sm">
              Топ 100 тоглогчийн XP зэрэглэл
            </p>
          </header>
          {podiumUsers.length >= 3 ? (
            <WebPodiumSection users={podiumUsers} />
          ) : (
            <div className="rounded-2xl border-3 border-dashed border-[#ead9bb] bg-transparent px-4 py-8 text-center text-sm text-[#3b2f2f] sm:p-10 sm:text-base dark:border-[#37464f] dark:text-[#bdb5a6]">
              Лиг эхлэхэд илүү олон тоглогч хэрэгтэй...
            </div>
          )}
          <WebLeaderboardList users={listUsers} />
        </div>
      </MainLayout>
    </div>
  );
}
