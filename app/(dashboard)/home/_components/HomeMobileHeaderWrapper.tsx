import { Header } from "@/app/_components/Bar-Sections/header";
import { loadHomeProgressSidebar } from "@/lib/server/home-dashboard-data";
import { auth } from "@clerk/nextjs/server";

export default async function HomeMobileHeaderWrapper() {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }

  const data = await loadHomeProgressSidebar(userId);

  return (
    <Header
      streak={data.streak}
      streakWeekDays={data.streakWeekDays}
      totalXp={data.xp}
      heartsRemaining={data.heartsRemaining}
      fixedOnDesktop={false}
    />
  );
}
