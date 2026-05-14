import type { ReadingDifficulty } from "../types/reading";

const DIFFICULTIES: Array<{ label: string; value: ReadingDifficulty }> = [
  { label: "Бүгд", value: "ALL" },
  { label: "Хялбар", value: "EASY" },
  { label: "Дунд", value: "MEDIUM" },
  { label: "Ахисан", value: "HARD" },
];

type DifficultyTabsProps = {
  value: ReadingDifficulty;
  onChange: (value: ReadingDifficulty) => void;
};

export const DifficultyTabs = ({
  onChange,
  value,
}: DifficultyTabsProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {DIFFICULTIES.map((difficulty) => (
        <button
          key={difficulty.value}
          type="button"
          onClick={() => onChange(difficulty.value)}
          className={`rounded-full border-3 px-3 py-2 text-sm font-semibold transition md:px-4 ${
            value === difficulty.value
              ? "border-[#E8920A] bg-transparent text-amber-900 dark:border-[#84d8ff] dark:text-[#e8e4dc]"
              : "border-amber-200/80 bg-transparent text-stone-700 hover:border-[#E8920A] dark:border-[#37464f] dark:text-[#94a3b8] dark:hover:border-[#84d8ff]/50"
          }`}
        >
          {difficulty.label}
        </button>
      ))}
    </div>
  );
};
