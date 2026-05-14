import type { Reading } from "../types/reading";
import { ReadingCard } from "./ReadingCard";

type ReadingGridProps = {
  readings: Reading[];
};

const difficultyLabels: Record<string, string> = {
  EASY: "Хялбар",
  MEDIUM: "Дунд",
  HARD: "Ахисан",
};

export const ReadingGrid = ({ readings }: ReadingGridProps) => {
  const groupedReadings = {
    EASY: readings.filter((reading) => reading.difficulty === "EASY"),
    MEDIUM: readings.filter((reading) => reading.difficulty === "MEDIUM"),
    HARD: readings.filter((reading) => reading.difficulty === "HARD"),
  };

  return (
    <div className="flex w-full flex-col gap-7 md:gap-10">
      {Object.entries(groupedReadings).map(([difficulty, items]) => {
        if (!items.length) return null;

        return (
          <section key={difficulty} className="flex flex-col gap-4 md:gap-5">
            <div className="flex items-center gap-3 md:gap-4">
              <h2 className="text-xl font-black text-[#2A2118] md:text-2xl">
                {difficultyLabels[difficulty]}
              </h2>

              <div className="h-px flex-1 bg-[#D9C7A3]" />
            </div>

            <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-3">
              {items.map((reading) => (
                <ReadingCard key={reading.id} reading={reading} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};
