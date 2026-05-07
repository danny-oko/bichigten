import { Header } from "@/app/_components/Bar-Sections/header";
import { HomePath } from "./_components/home-page-client";
import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { ensureUser } from "@/lib/server/ensure-user";
import { calculateDailyStreak } from "@/lib/server/daily-streak";

export default async function HomeSection() {
  const { userId } = await auth();

  let xp = 0;
  let streak = 0;
  let heartsRemaining = 3;

  if (userId) {
    const clerkUser = await currentUser();
    await ensureUser({
      id: userId,
      email: clerkUser?.emailAddresses[0]?.emailAddress,
      username: clerkUser?.username,
      name:
        [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ") ||
        undefined,
      avatarUrl: clerkUser?.imageUrl,
    });

    const [user, completedLessons] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { totalXp: true, heartsRemaining: true },
      }),
      prisma.userLessonProgress.findMany({
        where: { userId, status: "COMPLETED", completedAt: { not: null } },
        select: { completedAt: true },
      }),
    ]);

    xp = user?.totalXp ?? 0;
    heartsRemaining = user?.heartsRemaining ?? 5;
    streak = calculateDailyStreak(
      completedLessons
        .map((item) => item.completedAt)
        .filter((date): date is Date => Boolean(date)),
    );
  }

  return (
    <div className="flex min-h-full flex-col items-center bg-[#F0EDE3] pb-28 font-['Plus_Jakarta_Sans'] md:-ml-20 xl:-ml-65">
      <Header streak={streak} totalXp={xp} heartsRemaining={heartsRemaining} />
      <div className="flex min-h-0 flex-1 w-full flex-col items-center pt-20 sm:pt-24 md:pt-28">
        <HomePath />
      </div>
    </div>
  );
}
