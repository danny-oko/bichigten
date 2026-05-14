import ProfilePageBody from "./_components/ProfilePageBody";
import type { ProfileTab } from "./common/types";

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

  return <ProfilePageBody activeTab={activeTab} />;
}
