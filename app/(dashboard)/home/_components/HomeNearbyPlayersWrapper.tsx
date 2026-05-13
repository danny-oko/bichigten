import WebNearbyPlayers from "@/app/(dashboard)/leaderboard/_components/SocialPeersList";
import { loadHomeNearbyPlayers } from "@/lib/server/home-dashboard-data";
import { auth } from "@clerk/nextjs/server";

export default async function HomeNearbyPlayersWrapper() {
  const { userId } = await auth();
  if (!userId) {
    return <WebNearbyPlayers players={[]} />;
  }

  const players = await loadHomeNearbyPlayers(userId);
  return <WebNearbyPlayers players={players} />;
}
