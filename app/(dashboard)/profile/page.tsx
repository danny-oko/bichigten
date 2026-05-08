import { MainLayout } from "@/components/layout/MainLayout";
import prisma from "@/lib/prisma";
import { buildProfileUser } from "@/lib/server/build-profile-user";
import { getCurrentAppUser } from "@/lib/server/get-current-app-user";
import { redirect } from "next/navigation";
import LessonProgressCard from "../home/_components/LessonProgressCard";
import WebNearbyPlayers from "../leaderboard/_components/SocialPeersList";
import ProfileHeroEditable from "./_components/ProfileHeroEditable";
import ProfileSummaryStats from "./_components/ProfileSummaryStats";
import ProfileTabsSection from "./_components/ProfileTabsSection";
import type { ProfileTab, ProfileUser } from "./common/types";

const VALID_TABS: ProfileTab[] = [
  "overview",
  "achievements",
  "stats",
  "settings",
];

function parseTab(tab: string | undefined): ProfileTab {
  if (tab && VALID_TABS.includes(tab as ProfileTab)) {
    return tab as ProfileTab;
  }
  return "overview";
}

export default async function ProfilePage({
  searchParams,
}: {
  searchParams?: Promise<{ tab?: string }>;
}) {
  const q = searchParams ? await searchParams : {};
  const activeTab = parseTab(q.tab);

  const appUser = await getCurrentAppUser();
  if (!appUser) {
    redirect("/sign-in");
  }
  const [
    completedLessons,
    usersAbove,
    totalLessonsCount,
    inProgressLesson,
    firstLesson,
  ] = await Promise.all([
    prisma.userLessonProgress.findMany({
      where: { userId: appUser.id, status: "COMPLETED" },
      select: { lessonId: true },
      distinct: ["lessonId"],
    }),
    prisma.user.count({
      where: { totalXp: { gt: appUser.totalXp } },
    }),
    prisma.lesson.count(),
    prisma.userLessonProgress.findFirst({
      where: { userId: appUser.id, status: "IN_PROGRESS" },
      select: { lesson: { select: { id: true, title: true } } },
    }),
    prisma.lesson.findFirst({
      orderBy: { order: "asc" },
      select: { id: true, title: true },
    }),
  ]);
  const leaguePosition = usersAbove + 1;

  const profile = await buildProfileUser(appUser, leaguePosition);
  const currentUser: ProfileUser = { ...profile, activeTab };
  const nextLesson = inProgressLesson?.lesson ?? firstLesson;
  const nextLessonHref = nextLesson
    ? `/lesson/${nextLesson.id}`
    : "/dictionary";
  const nextLessonTitle = nextLesson?.title ?? "Explore Dictionary";
  const nearbyPlayers = currentUser.league.entries.slice(0, 5).map((entry) => ({
    id: `${entry.rank}-${entry.name}`,
    rank: entry.rank,
    name: entry.name,
    xp: entry.xp,
    xpChange: 0,
    avatarUrl: null,
    isMe: Boolean(entry.isCurrentUser),
  }));
  const profileAside = (
    <>
      <LessonProgressCard
        completedLessons={completedLessons.length}
        totalLessons={totalLessonsCount}
        nextLessonHref={nextLessonHref}
        nextLessonTitle={nextLessonTitle}
      />
      <WebNearbyPlayers players={nearbyPlayers} />
    </>
  );

  return (
    <div className="min-h-screen bg-[#FFF8E7] pb-24 text-[#3b2f2f] md:pb-10">
      <MainLayout aside={profileAside}>
        <div className="flex flex-col gap-4 md:gap-5">
          <ProfileHeroEditable
            name={currentUser.name}
            username={currentUser.username}
            memberSince={currentUser.memberSince}
            avatarUrl={currentUser.avatarUrl}
            avatarInitial={currentUser.avatarInitial}
            rankTitle={currentUser.rankTitle}
            language={currentUser.language}
            initialName={appUser.name ?? ""}
            initialUserName={appUser.userName}
            initialAvatarUrl={appUser.avatarUrl ?? ""}
          />
          <ProfileSummaryStats user={currentUser} />
          <ProfileTabsSection initialTab={activeTab} currentUser={currentUser} />
        </div>
      </MainLayout>
    </div>
  );
}
