const RANK_TIERS: readonly { minXp: number; name: string }[] = [
  { minXp: 3700, name: "Дархан Аварга" },
  { minXp: 2550, name: "Даян Аварга" },
  { minXp: 1920, name: "Аварга" },
  { minXp: 1560, name: "Арслан" },
  { minXp: 1000, name: "Гарьд" },
  { minXp: 560, name: "Заан" },
  { minXp: 350, name: "Харцага" },
  { minXp: 0, name: "Начин" },
];

export function getRankNameFromXp(totalXp: number): string {
  const xp = Math.floor(Number(totalXp));

  if (Number.isNaN(xp) || xp < 0) {
    return "Начин";
  }

  for (const tier of RANK_TIERS) {
    if (xp >= tier.minXp) {
      return tier.name;
    }
  }

  return "Начин";
}
