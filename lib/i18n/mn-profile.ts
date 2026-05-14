/** Mongolian copy for profile / dashboard profile UI */

export const mnProfile = {
  dowUtc: ["Ня", "Да", "Мя", "Лх", "Пү", "Ба", "Бя"] as const,

  tabOverview: "Тойм",
  tabAchievements: "Амжилтууд",
  tabStats: "Статистик",
  tabSettings: "Тохиргоо",

  exploreDictionary: "Цагаан толгой",

  lessonCardTitle: "Хичээлийн явц",
  lessonCardSubtitle: (done: number, total: number) =>
    `${done}/${total} хичээл дууссан`,
  nextLesson: "Дараагийн хичээл",

  summaryTotalXp: "Нийт XP",
  summaryLeague: "Онооны самбар",
  summaryHearts: "Зүрх",
  summaryStreak: "Ирц",
  summaryBadges: "Амжилтууд",

  achievementsTitle: "Амжилтууд",
  achievementsEarned: (unlocked: number, total: number) =>
    `${unlocked}/${total}`,

  leagueYou: "Та",
  leagueXpSuffix: " XP",

  experienceTitle: "Оноо",
  experienceLevel: (n: number) => `Түвшин ${n}`,

  journeyLearnCharacters: "Үсэг сурах",
  journeyPracticeTime: "Дасгал",

  weeklyActivityTitle: "Долоо хоногийн идэвх",
  weeklyActivityLine: (xp: string, days: string) =>
    `${xp} XP энэ долоо хоногт · Идэвхтэй ${days} өдөр`,

  settingsHint:
    "Нэр, хэрэглэгчийн нэр, зурагны холбоосыг доорх «Бүртгэлийн мэдээлэл»-ээс өөрчилнө үү.",
  settingsSectionTitle: "Тохиргоо",
  logOut: "Гарах",

  appearanceTitle: "Харагдах байдал",
  appearanceBody:
    "Харанхуй горимыг энэ хөтөч дээр урьдчилан үзэх. Тохиргоо зөвхөн таны төхөөрөмж дээр хадгалагдана.",

  notificationsTitle: "Мэдэгдэл",
  notificationsBody:
    "Дасгал сануулах (одоогоор зөвхөн энэ хөтөч дээр хадгална).",
  notificationsDaily: "Өдөр бүрийн сануулга (и-мэйл)",
  notificationsOn: "Асаалттай",
  notificationsOff: "Унтраалттай",

  helpTitle: "Тусламж",
  helpBody:
    "Хичээл эсвэл бүртгэлтэй холбоотой асуудал байвал бидэнтэй холбогдоно уу.",
  helpEmailCta: "И-мэйл илгээх",

  accountSectionTitle: "Бүртгэлийн мэдээлэл",
  displayName: "Хэрэглэгчийн нэр",
  avatarUrl: "Зурагны холбоос",
  urlPlaceholder: "https://…",
  saved: "Хадгалагдлаа.",
  saveFailed: "Хадгалхад алдаа гарлаа.",
  networkError: "Сүлжээний алдаа. Дахин оролдоно уу!",

  heroJoined: "Элссэн",
  heroAt: (username: string, memberSince: string) =>
    `@${username} · Элссэн ${memberSince}`,
  saveChangesFailed: "Өөрчлөлтийг хадгалхад алдаа гарлаа.",
  networkErrorRetry: "Сүлжээний алдаа. Дахин оролдоно уу.",

  streakTitle: "Ирц",
  streakHoverSubtitle: "Өдөр бүр хичээлээ дуусгаж ирцээ ахиулна уу.",
  streakCurrent: "Одоогийн ирц",
  streakDaysBest: (current: number, best: number) =>
    `${current} өдөр · Шилдэг: ${best}`,
  streakFreezeUnavailable: "Одоогоор ирц хөлдөөх боломжгүй",
  streakFreezeCta: (left: number) => `Ирц хөлдөөх (${left} үлдсэн)`,

  heatmapRowLabels: ["Да", "Лх", "Ба"] as const,
  /** UTC month headers — avoid `toLocaleString("mn-MN")` (Node vs browser ICU differs → hydration errors). */
  heatmapMonthShortUtc: [
    "1-р сар",
    "2-р сар",
    "3-р сар",
    "4-р сар",
    "5-р сар",
    "6-р сар",
    "7-р сар",
    "8-р сар",
    "9-р сар",
    "10-р сар",
    "11-р сар",
    "12-р сар",
  ] as const,
  heatmapNoActivity: "Идэвхигүй",
  heatmapLessons: (n: number) => (n === 1 ? "1 хичээл" : `${n} хичээл`),

  languageDisplay: "Монгол",

  leagueName: (rankTitle: string) => `${rankTitle} цол`,
  leagueResetDays: (d: number) => `${d} өдрийн дараа шинэчлэгдэнэ`,

  levelTitle: (level: number) => `Түвшин ${level} сурагч`,
  streakLabel: (days: number) => `${days} өдрийн ирц`,
  levelProgressLine: (cur: string, need: string) => `${cur} / ${need} XP`,
  toNextLevelLine: (xp: string, nextLevel: number) =>
    `${xp} XP — түвшин ${nextLevel} хүртэл`,

  journeyModuleLabel: "Одоо үзэж буй бүлэг сэдэв",
  journeyEmptyTitle: "Түвшин байхгүй",
  journeyEmptyDescription:
    "Өгөгдлийн санд хэсэг, хичээл нэмснээр явц энд харагдана.",
  lessonsProgress: (done: number, total: number) => `${done} / ${total} хичээл`,
  lessonsLeftOne: "1 хичээл үлдлээ",
  lessonsLeftMany: (n: number) => `${n} хичээл үлдлээ`,
  moduleComplete: "Бүлэг сэдэв дууссан",
  inProgressCount: (n: number) => `${n} үргэлжилж байна`,
  completedCount: (n: number) => `${n} дууссан`,
  notStarted: "Эхлээгүй",

  badges: {
    b1: "Анхны хичээл",
    b2: "5 хичээл",
    b3: "10 хичээл",
    b4: "7 өдрийн ирц",
    b5: "100 XP",
    b6: "500 XP",
    b7: "1000 XP",
    b8: "25 хичээл",
  } as const,

  challenges: {
    c1Title: "Энэ долоо хоногийн хичээл",
    c1Subtitle: "Сүүлийн 7 өдөр",
    c2Title: "Өнөөдрийн хичээл",
    c2Subtitle: "UTC өдөрт дуусгах",
    c3Title: "Энэ долоо хоногийн XP",
    c3Subtitle: "Дууссан хичээлээс",
    xpUnit: "оноо",
  } as const,

  settingAccountLabel: "Бүртгэл",
  settingAccountDesc: "Хэрэглэгчийн нэр, хувийн мэдээлэл",
  settingAppearanceLabel: "Харагдах байдал",
  settingAppearanceDesc: "Загвар, үсгийн хэмжээ, харанхуй горим",
  settingNotificationsLabel: "Мэдэгдэл",
  settingNotificationsDesc: "Cануулах цаг",
  settingHelpLabel: "Тусламж",
  settingHelpDesc: "Түгээмэл асуулт, холбоо барих",
} as const;
