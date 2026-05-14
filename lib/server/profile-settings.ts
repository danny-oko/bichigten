import type { ProfileSettingItem } from "@/app/(dashboard)/profile/common/types";
import { mnProfile } from "@/lib/i18n/mn-profile";

export const PROFILE_SETTING_ITEMS: ProfileSettingItem[] = [
  {
    id: "account",
    label: mnProfile.settingAccountLabel,
    description: mnProfile.settingAccountDesc,
    icon: "👤",
  },
  {
    id: "appearance",
    label: mnProfile.settingAppearanceLabel,
    description: mnProfile.settingAppearanceDesc,
    icon: "🌤",
  },
  {
    id: "notifications",
    label: mnProfile.settingNotificationsLabel,
    description: mnProfile.settingNotificationsDesc,
    icon: "🔔",
  },
];
