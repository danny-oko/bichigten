export type ProfileTab = "overview" | "achievements" | "stats" | "settings";

export type ProfileAppUser = {
  id: string;
  email: string;
  userName: string;
  name: string | null;
  avatarUrl: string | null;
  totalXp: number;
  heartsRemaining: number;
  createdAt: Date;
};

export type ProfileBadge = {
  id: string;
  label: string;
  icon: string;
  unlocked: boolean;
};

export type DailyChallenge = {
  id: string;
  title: string;
  subtitle: string;
  progressText: string;
  progressPercent: number;
  xpReward?: number;
  done?: boolean;
};

export type JourneyProgress = {
  moduleLabel: string;
  title: string;
  description: string;
  lessonProgressText: string;
  completionPercent: number;
  lessonsLeftText: string;
  characterProgressText: string;
  practiceProgressText: string;
};

export type StreakDayDot = {
  label: string;
  completed: boolean;
};

export type StreakInfo = {
  current: number;
  best: number;
  days: StreakDayDot[];
  frozenCount: number;
};

export type WeeklyStats = {
  xpThisWeek: number;
  daysThisWeek: string;
};

export type ActivityHeatmapDay = {
  dateKey: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

export type ExperienceInfo = {
  currentLevel: number;
  currentXp: number;
  nextLevelXp: number;
};

export type LeagueEntry = {
  rank: number;
  name: string;
  xp: number;
  isCurrentUser?: boolean;
};

export type ProfileSettingItem = {
  id: string;
  label: string;
  description: string;
  icon: string;
};

export type ProfileUser = {
  id: string;
  email: string;
  name: string;
  username: string;
  avatarUrl: string | null;
  avatarInitial: string;
  heartsRemaining: number;
  memberSince: string;
  rankTitle: string;
  language: string;
  streakLabel: string;
  level: number;
  levelTitle: string;
  totalXp: number;
  levelProgressText: string;
  toNextLevelText: string;
  leaguePosition: number;
  streakCount: number;
  badgeCount: number;
  /** Distinct lessons marked completed (sidebar + consistency). */
  completedLessonsCount: number;
  activeTab: ProfileTab;
  weeklyStats: WeeklyStats;
  activityHeatmap: ActivityHeatmapDay[];
  streak: StreakInfo;
  experience: ExperienceInfo;
  dailyChallenges: DailyChallenge[];
  journey: JourneyProgress;
  badges: ProfileBadge[];
  settings: ProfileSettingItem[];
  league: {
    name: string;
    resetInText: string;
    entries: LeagueEntry[];
  };
};
