"use client";

import { Button } from "@/components/ui/button";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { BottomSheet } from "./BottomSheet";
import { Character } from "./CharacterCard";
import { CharacterDetail } from "./CharacterDetail";
import { LetterGrid } from "./LetterGrid";

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
    <div className="min-h-full w-full overflow-x-hidden px-4 py-6 font-balsamiq text-[#3b2f2f] dark:text-[#9ba3a7] md:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-6">
          <h1 className="text-4xl font-bold tracking-normal text-[#E8920A] md:text-5xl dark:text-[#84d8ff]">
            Цагаан толгой
          </h1>
          <p className="mt-2 max-w-2xl text-base font-bold text-[#7a5930] dark:text-[#94a3b8]">
            Уламжлалт монгол бичгийн зурлага, үсгийн хувилбар дүрсийг судлан,
            бичих зүй тогтол, дарааллыг эзэмших.
          </p>
        </header>

        <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="min-w-0 rounded-2xl border-3 border-[#E8920A] p-5 bg-transparent dark:border-[#37464f] shadow-[0_18px_45px_rgba(122,89,48,0.12)] md:p-5">
            <div className="mb-4 hidden items-center justify-between gap-3 xl:flex">
              <h2 className="text-xl font-bold text-[#3b2f2f] dark:text-[#d8d2c4]">
                Үсэгнүүд
              </h2>
              <div className="flex gap-2">
                {FILTER_TABS.map((tab) => {
                  const isActive = filter === tab.value;
                  return (
                    <Button
                      key={tab.value}
                      type="button"
                      variant="sortbutton"
                      size="sort"
                      aria-pressed={isActive}
                      onClick={() => handleFilterSelect(tab.value)}
                    >
                      {tab.label}
                    </Button>
                  );
                })}
              </div>
              <span className="shrink-0 rounded-full border border-[#E8920A]/35 bg-[#E8920A]/10 px-3 py-1 text-sm font-bold text-[#7a5930] dark:border-[#84d8ff] dark:bg-[#84d8ff]/15 dark:text-[#fff]">
                {filteredCharacters.length} Үсэг
              </span>
            </div>

            <div className="xl:hidden">
              <div className="mb-2 flex items-center justify-between gap-3">
                <h2 className="text-xl font-bold text-[#3b2f2f] dark:text-[#d8d2c4]">
                  Үсэгнүүд
                </h2>

                <div className="relative" ref={dropdownRef}>
                  <Button
                    type="button"
                    variant="sortbutton"
                    size="sort"
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="listbox"
                    aria-pressed={filter !== "ALL"}
                    className="flex items-center gap-1.5"
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                  >
                    {activeLabel}
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      aria-hidden
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
                  </Button>

                  {isDropdownOpen && (
                    <div
                      className="absolute left-0 top-full z-20 mt-2 min-w-[148px] overflow-hidden rounded-2xl border border-border bg-popover text-popover-foreground shadow-[0_8px_24px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
                      role="listbox"
                    >
                      {FILTER_TABS.map((tab, i) => (
                        <Fragment key={tab.value}>
                          {i === 1 && (
                            <div className="mx-3 h-px bg-border" />
                          )}
                          <button
                            type="button"
                            role="option"
                            aria-selected={filter === tab.value}
                            onClick={() => handleFilterSelect(tab.value)}
                            className={[
                              "flex w-full items-center gap-2 px-4 py-3 text-left font-balsamiq text-sm font-bold transition hover:bg-muted",
                              filter === tab.value
                                ? "text-primary"
                                : "text-foreground",
                            ].join(" ")}
                          >
                            <span className="w-4 text-center">
                              {filter === tab.value ? "✓" : ""}
                            </span>
                            {tab.label}
                          </button>
                        </Fragment>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <span className="rounded-full border border-[#E8920A]/35 bg-[#E8920A]/10 px-3 py-1 text-sm font-bold text-[#7a5930] dark:border-[#84d8ff] dark:bg-[#84d8ff]/15 dark:text-[#94a3b8]">
                  {filteredCharacters.length} Үсэг
                </span>
              </div>
            </div>

            <LetterGrid
              characters={filteredCharacters}
              selectedCharacter={selectedCharacter}
              onSelect={handleMobileSelect}
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
