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
          className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
            value === difficulty.value
              ? "border-amber-500 bg-amber-100 text-amber-900"
              : "border-amber-100 bg-white/80 text-stone-700 hover:border-amber-300"
          }`}
        >
          {difficulty.label}
        </button>
      ))}
    </div>
  );
};
