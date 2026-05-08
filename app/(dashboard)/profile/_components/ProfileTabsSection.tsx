"use client";

import { useState } from "react";

import type { ProfileTab, ProfileUser } from "../common/types";
import ProfileTabContent from "./ProfileTabContent";
import ProfileTabs from "./ProfileTabs";

type ProfileTabsSectionProps = {
  initialTab: ProfileTab;
  currentUser: ProfileUser;
};

export default function ProfileTabsSection({
  initialTab,
  currentUser,
}: ProfileTabsSectionProps) {
  const [activeTab, setActiveTab] = useState<ProfileTab>(initialTab);

  return (
    <>
      <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <ProfileTabContent activeTab={activeTab} currentUser={currentUser} />
    </>
  );
}
