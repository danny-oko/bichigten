import WebNearbyPlayers from "@/app/(dashboard)/leaderboard/_components/SocialPeersList";
import { loadProfileAsideNearbyPlayers } from "@/lib/server/profile-aside-data";

export default async function ProfileAsideNearbyPlayersWrapper({
  userId,
  totalXp,
  displayName,
}: {
  userId: string;
  totalXp: number;
  displayName: string;
}) {
  const players = await loadProfileAsideNearbyPlayers(
    userId,
    totalXp,
    displayName,
  );
  return <WebNearbyPlayers players={players} />;
}
