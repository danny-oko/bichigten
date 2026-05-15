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

  helpTitle: "Яагаад Mazaalai-Learn гэж?",
  helpAppIntro:
    "Mazaalai Learn нь монгол бичгийн үсгийг, video хичээл тоглоомжуулсан контентоор дамжуулан суралцах платформ.\n\nДоорх хэсгүүдээс багийн мэдээлэл, төсөл эхэлсэн шалтгаан болон ашиглагдсан технологийн талаар харж болно.",
  helpAccordionTeamTitle: "Team Bichigten",
  helpAccordionWhyTitle: "Яагаад? — Үндсэн шалтгаан",
  helpAccordionChallengesTitle: "Хэрхэн шийдвэрлэсэн бэ?",
  helpChallengesWinBadge: "",
  helpChallengesBullets: [
    "● Тодорхойгүй байдлууд: Санал асуулга болон олонхын саналыг тусгах, Brain storming, Төлөвлөгөө",
    "● Баг дундах мэдээллийн хоцрогдол: Өдөр болгон Stand Meeting хийсэн",
    // "● ",
    // "● 4 дэх 7хоног: Wrapping up . Everyone's focused determined .... :D",
  ] as const,
  helpAccordionTechTitle: "Tech stack",
  // helpTechStackIntro: "Next.js App Router, Tailwind CSS дээр суурилсан",
  helpTechGroupEngine: "Engine",
  helpTechGroupAi: "AI & Logic",
  helpTechGroupManagement: "Management & Designing",
  // helpTeamNoContribution: "Одоогоор тодорхой хэсэг заагаагүй байна.",
  helpRootCauseLead: "",
  helpRootCauseParagraphs: [
    "Монгол Улс 2025 оноос хос бичигтэн болох зорилт тавьж, хуулиараа дэмжигдэн хэрэгжиж эхэлсэн ч сургалтын чанар жигд бус, хэрэглээ бага хэвээр. Тиймээс одоог хүртэл сурагчид болон насанд хүрэгчдийн дийлэнх нь монгол бичгээр чөлөөтэй уншиж бичиж сураагүй.",
    "2025 онд шалгалт өгөх хүрээ өргөжиж, 10–12-р ангийн сурагчид хамрагдах болсноор шалгалт өгөгчдийн тоо 83,374 хүрсөн. Гэвч үүнээс 12,964 нь босго оноо болох 400 оноог давж чадсангүй.",
    "2026 оны хаврын шалгалтад 87 мянга гаруй сурагч оролцож, 10 гаруй хувь нь буюу 8,700 орчим хүүхэд мөн адил босго оноогоо давж чадсангүй.",
  ] as const,
  helpChartExamTitle: "Шалгалтын оролцоо ба босгоо давсангүй (тоо)",
  helpChartExamCaption:
    "Үзүүлэлт нь нийтлэл, мэдээллийн эх сурвалжид тулгуурласан ойлголт — график нь чиг хандлагыг харуулах зориулалттай.",
  helpChartLegendParticipants: "Оролцогч",
  helpChartLegendBelow: "400 оноо давж чадаагүй",

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
  settingNotificationsDesc: "Сануулах цаг",

  settingFaqLabel: "Mazaalai-learn гэж? / FAQ",
  settingFaqDesc: "Баг, төслийн шалтгаан, шийдэл, ашигласан технологийн талаар",
} as const;
