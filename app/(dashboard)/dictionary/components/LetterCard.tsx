"use client";

export interface Form {
  type: "INITIAL" | "MEDIAL" | "FINAL" | "ISOLATE";
  glyph: string;
  imgUrl?: string;
  strokePath?: string;
  viewBox?: string;
}

export interface Character {
  id: string;
  name: string;
  unicode: string;
  latinForm?: string;
  description?: string;
  type: "VOWEL" | "CONSONANT" | "PUNCTUATION";
  order: number;
  forms: Form[];
}

interface LetterCardProps {
  character: Character;
  onSelect: (character: Character) => void;
  isSelected?: boolean;
}

export const LetterCard = ({
  character,
  onSelect,
  isSelected = false,
}: LetterCardProps) => {
  const isolateForm = character.forms.find((form) => form.type === "ISOLATE");
  const glyph = isolateForm?.glyph ?? character.forms[0]?.glyph ?? "?";

  return (
    <button
      type="button"
      onClick={() => onSelect(character)}
      className={[
        "group flex aspect-square min-h-[136px] w-full items-center justify-center",
        "rounded-2xl border-3 text-center shadow-none transition duration-200",
        "hover:scale-105 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8920a] focus-visible:ring-offset-2 dark:focus-visible:border-[#84d8ff] dark:focus-visible:ring-[#84d8ff]",
        isSelected
          ? "border-[#e8920a] bg-[#e8920a] shadow-[0_10px_24px_rgba(232,146,10,0.25)] ring-2 ring-[#e8920a]/25 dark:border-[#84d8ff] dark:bg-[#84d8ff]/15 dark:shadow-none dark:ring-[#84d8ff]/25"
          : "border-[#ead9bb] bg-transparent hover:border-[#e8920a] dark:border-[#37464f] dark:not-aria-pressed:bg-transparent dark:hover:border-[#84d8ff] dark:hover:bg-[#84d8ff]/15",
      ].join(" ")}
      aria-pressed={isSelected}
    >
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-3 py-4">
        <span className="flex h-16 w-full shrink-0 items-center justify-center md:h-[72px]">
          <span
            className={[
              "mongol-script block text-center text-[46px] font-normal leading-none transition-colors md:text-[54px]",
              isSelected
                ? "text-white dark:text-white"
                : "text-[#3b2f2f] group-hover:text-[#c97806] dark:text-[#94a3b8] dark:group-hover:text-white",
            ].join(" ")}
          >
            {glyph}
          </span>
        </span>

        <span
          className={[
            "flex h-5 shrink-0 items-center justify-center font-balsamiq text-sm font-bold leading-none transition-colors",
            isSelected
              ? "text-white/90 dark:text-white"
              : "text-[#7a5930] group-hover:text-[#c97806] dark:text-[#94a3b8] dark:group-hover:text-white",
          ].join(" ")}
        >
          {character.latinForm?.toUpperCase() ?? character.name}
        </span>
      </div>
    </button>
  );
};
