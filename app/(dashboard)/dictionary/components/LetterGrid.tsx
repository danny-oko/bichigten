"use client";

import { Character, LetterCard } from "./LetterCard";

export const LetterGrid = ({
  characters,
  selectedCharacter,
  onSelect,
}: {
  characters: Character[];
  selectedCharacter?: Character | null;
  onSelect: (character: Character) => void;
}) => {
  return (
    <section className="w-full min-w-0">
      {characters.length === 0 ? (
        <div className="flex h-40 items-center justify-center rounded-2xl border border-[#ead9bb] bg-white font-balsamiq text-sm font-bold text-[#7a5930] shadow-sm">
          No characters found.
        </div>
      ) : (
        <div className="grid min-w-0 grid-cols-3 gap-4 sm:grid-cols-4 xl:grid-cols-6">
          {characters.map((character) => (
            <LetterCard
              key={character.id}
              character={character}
              isSelected={selectedCharacter?.id === character.id}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </section>
  );
};
