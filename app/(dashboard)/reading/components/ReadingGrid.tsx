import type { Reading } from "../types/reading";
import { ReadingCard } from "./ReadingCard";

type ReadingGridProps = {
  readings: Reading[];
};

export const ReadingGrid = ({ readings }: ReadingGridProps) => {
  return (
    <div className="grid w-full gap-5 md:grid-cols-2 xl:grid-cols-3">
      {readings.map((reading) => (
        <ReadingCard key={reading.id} reading={reading} />
      ))}
    </div>
  );
};
