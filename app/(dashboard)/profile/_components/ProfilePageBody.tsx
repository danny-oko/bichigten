import { Suspense } from "react";

import { MainLayout } from "@/components/layout/MainLayout";
import { getCurrentAppUser } from "@/lib/server/get-current-app-user";
import { redirect } from "next/navigation";

import type { ProfileTab } from "../common/types";
import ProfileAsideLessonProgressWrapper from "./ProfileAsideLessonProgressWrapper";
import ProfileAsideNearbyPlayersWrapper from "./ProfileAsideNearbyPlayersWrapper";
import {
  ProfileLessonProgressCardSkeleton,
  ProfileNearbyPlayersSkeleton,
} from "./ProfileAsideSkeletons";
import ProfileMainColumn from "./ProfileMainColumn";
import ProfileMainColumnSkeleton from "./ProfileMainColumnSkeleton";

type ProfilePageBodyProps = {
  activeTab: ProfileTab;
};

export default async function ProfilePageBody({
  activeTab,
}: ProfilePageBodyProps) {
  const appUser = await getCurrentAppUser();
  if (!appUser) {
    redirect("/sign-in");
  }

  const displayName = appUser.name ?? appUser.userName;

  const profileAside = (
    <>
      <Suspense fallback={<ProfileLessonProgressCardSkeleton />}>
        <ProfileAsideLessonProgressWrapper userId={appUser.id} />
      </Suspense>
      <Suspense fallback={<ProfileNearbyPlayersSkeleton />}>
        <ProfileAsideNearbyPlayersWrapper
          userId={appUser.id}
          totalXp={appUser.totalXp}
          displayName={displayName}
        />
      </Suspense>
    </>
  );

  return (
    <div className="profile-page-shell min-h-screen overflow-x-hidden bg-transparent pb-24 text-[#3b2f2f] md:pb-10 dark:text-[#d8d2c4]">
      <MainLayout aside={profileAside}>
        <Suspense fallback={<ProfileMainColumnSkeleton />}>
          <ProfileMainColumn activeTab={activeTab} appUser={appUser} />
        </Suspense>
      </MainLayout>
    </div>
  );
}
