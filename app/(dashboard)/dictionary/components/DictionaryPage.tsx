"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BottomSheet } from "./BottomSheet";
import { CharacterDetail } from "./CharacterDetail";
import { LetterGrid } from "./LetterGrid";
import { Character } from "./CharacterCard";

type Filter = "ALL" | "VOWEL" | "CONSONANT";

const FILTER_TABS: { label: string; value: Filter }[] = [
  { label: "Бүгд", value: "ALL" },
  { label: "Эгшиг", value: "VOWEL" },
  { label: "Гийгүүлэгч", value: "CONSONANT" },
];

export const DictionaryPage = ({ characters }: { characters: Character[] }) => {
  const [filter, setFilter] = useState<Filter>("ALL");
  const [query, setQuery] = useState("");
  const [selectedCharacterId, setSelectedCharacterId] = useState(
    characters[0]?.id ?? "",
  );
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCharacters = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return characters.filter((character) => {
      const matchesFilter = filter === "ALL" || character.type === filter;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        character.name.toLowerCase().includes(normalizedQuery) ||
        character.latinForm?.toLowerCase().includes(normalizedQuery) ||
        character.unicode.toLowerCase().includes(normalizedQuery) ||
        character.forms.some((form) =>
          form.glyph.toLowerCase().includes(normalizedQuery),
        );
      return matchesFilter && matchesQuery;
    });
  }, [characters, filter, query]);

  const selectedCharacter =
    filteredCharacters.find((c) => c.id === selectedCharacterId) ??
    filteredCharacters[0] ??
    null;

  const handleMobileSelect = (character: Character) => {
    setSelectedCharacterId(character.id);
    setIsSheetOpen(true);
  };

  const handleFilterSelect = (value: Filter) => {
    setFilter(value);
    setIsDropdownOpen(false);
    setIsSheetOpen(false);
  };

  const activeLabel =
    FILTER_TABS.find((t) => t.value === filter)?.label ?? "Бүгд";

  return (
    <div className="min-h-full w-full overflow-x-hidden bg-[#FFF8E7] px-4 py-6 font-balsamiq text-[#3b2f2f] md:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-6">
          <h1 className="text-4xl font-bold tracking-normal text-[#3b2f2f] md:text-5xl">
            Цагаан толгой
          </h1>
          <p className="mt-2 max-w-2xl text-base font-bold text-[#7a5930]">
            Уламжлалт монгол бичгийн зурлага, үсгийн хувилбар дүрсийг судлан,
            бичих зүй тогтол, дарааллыг эзэмших.
          </p>
        </header>

        <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="min-w-0 rounded-2xl border border-[#ead9bb] bg-[#fffdf7] p-4 shadow-[0_18px_45px_rgba(122,89,48,0.12)] md:p-5">
            <div className="mb-4 hidden items-center justify-between gap-3 xl:flex">
              <h2 className="text-xl font-bold text-[#3b2f2f]">Үсэгнүүд</h2>
              <div className="flex gap-2">
                {FILTER_TABS.map((tab) => {
                  const isActive = filter === tab.value;
                  return (
                    <button
                      key={tab.value}
                      type="button"
                      onClick={() => handleFilterSelect(tab.value)}
                      className={[
                        "rounded-full border px-5 py-2 font-balsamiq text-sm font-bold transition",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8920a] focus-visible:ring-offset-2",
                        isActive
                          ? "border-[#e8920a] bg-[#e8920a] text-white shadow-[0_10px_24px_rgba(232,146,10,0.25)] hover:bg-[#c97806]"
                          : "border-[#ead9bb] bg-white text-[#3b2f2f] hover:border-[#e8920a] hover:text-[#c97806]",
                      ].join(" ")}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
              <span className="shrink-0 rounded-full bg-[#f8e7c7] px-3 py-1 text-sm font-bold text-[#7a5930]">
                {filteredCharacters.length} Үсэг
              </span>
            </div>

            <div className="xl:hidden">
              <div className="mb-2 flex items-center justify-between gap-3">
                <h2 className="text-xl font-bold text-[#3b2f2f]">Үсэгнүүд</h2>

                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    className={[
                      "flex items-center gap-1.5 rounded-full border px-5 py-2 font-balsamiq text-sm font-bold transition",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8920a] focus-visible:ring-offset-2",
                      filter !== "ALL"
                        ? "border-[#e8920a] bg-[#e8920a] text-white shadow-[0_10px_24px_rgba(232,146,10,0.25)]"
                        : "border-[#ead9bb] bg-white text-[#3b2f2f] hover:border-[#e8920a] hover:text-[#c97806]",
                    ].join(" ")}
                  >
                    {activeLabel}
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      className={[
                        "transition-transform duration-200",
                        isDropdownOpen ? "rotate-180" : "",
                      ].join(" ")}
                    >
                      <path
                        d="M2 4L6 8L10 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute left-0 top-full z-20 mt-2 min-w-[148px] overflow-hidden rounded-2xl border border-[#ead9bb] bg-white shadow-[0_8px_24px_rgba(122,89,48,0.15)]">
                      {FILTER_TABS.map((tab, i) => (
                        <>
                          {i === 1 && (
                            <div
                              key="divider"
                              className="mx-3 h-px bg-[#ead9bb]"
                            />
                          )}
                          <button
                            key={tab.value}
                            type="button"
                            onClick={() => handleFilterSelect(tab.value)}
                            className={[
                              "flex w-full items-center gap-2 px-4 py-3 text-left font-balsamiq text-sm font-bold transition hover:bg-[#fff2d6]",
                              filter === tab.value
                                ? "text-[#e8920a]"
                                : "text-[#3b2f2f]",
                            ].join(" ")}
                          >
                            <span className="w-4 text-center">
                              {filter === tab.value ? "✓" : ""}
                            </span>
                            {tab.label}
                          </button>
                        </>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <span className="rounded-full bg-[#f8e7c7] px-3 py-1 text-sm font-bold text-[#7a5930]">
                  {filteredCharacters.length} Үсэг
                </span>
              </div>
            </div>

            <LetterGrid
              characters={filteredCharacters}
              selectedCharacter={selectedCharacter}
              onSelect={handleMobileSelect}
              filter={filter}
              onFilterChange={setFilter}
            />
          </section>

          <aside className="hidden min-w-0 xl:block">
            {selectedCharacter && (
              <CharacterDetail
                key={selectedCharacter.id}
                character={selectedCharacter}
                compact
              />
            )}
          </aside>
        </div>
      </div>

      <BottomSheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)}>
        {selectedCharacter && (
          <CharacterDetail
            key={selectedCharacter.id}
            character={selectedCharacter}
          />
        )}
      </BottomSheet>
    </div>
  );
};
