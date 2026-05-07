"use client";

import { useMemo, useState } from "react";
import { Character, Form } from "./LetterCard";
import StrokeAnimation from "./StrokeAnimation";

const FORM_LABELS: Record<string, string> = {
  INITIAL: "Эхэнд",
  MEDIAL: "Дунд",
  FINAL: "Адагт",
};

const FORM_DESCRIPTIONS: Record<string, string> = {
  INITIAL: "Used at word start",
  MEDIAL: "Used within words",
  FINAL: "Used at word end",
};

const FORM_ORDER = ["INITIAL", "MEDIAL", "FINAL"];

export const CharacterDetail = ({
  character,
  compact = false,
}: {
  character: Character;
  compact?: boolean;
}) => {
  // FORM-уудыг зөв дарааллаар авах
  const forms = useMemo(() => {
    return FORM_ORDER.map((type) =>
      character.forms.find((form) => form.type === type),
    ).filter(Boolean) as Form[];
  }, [character]);

  // Аль form идэвхтэй вэ
  const [selectedFormType, setSelectedFormType] = useState("MEDIAL");

  const selectedForm =
    forms.find((form) => form.type === selectedFormType) ??
    forms[1] ??
    forms[0];

  //  Stroke animation state
  const [play, setPlay] = useState(false);

  return (
    <div
      className={[
        "rounded-2xl border border-[#ead9bb] bg-white text-[#3b2f2f] shadow-[0_18px_45px_rgba(122,89,48,0.12)]",
        compact ? "h-full p-5" : "p-6 md:p-8",
      ].join(" ")}
    >
      <div
        className={
          compact
            ? "mb-5 flex items-start justify-between"
            : "mb-9 flex items-start justify-between"
        }
      >
        <div>
          <h2
            className={[
              "font-balsamiq font-bold text-[#3b2f2f]",
              compact ? "text-3xl" : "text-4xl",
            ].join(" ")}
          >
            {character.name}
          </h2>

          <p className="mt-1 font-balsamiq text-sm font-bold text-[#7a5930]">
            /{character.latinForm}/ phoneme
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setPlay(false);
            setTimeout(() => setPlay(true), 10);
          }}
          className="rounded-full bg-[#e8920a] px-5 py-2 font-balsamiq text-sm font-bold text-white shadow transition hover:bg-[#c97806] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8920a] focus-visible:ring-offset-2"
        >
          Тоглуулах
        </button>
      </div>

      <section className={compact ? "mb-5" : "mb-8"}>
        <h3 className="mb-4 font-balsamiq text-xs font-bold uppercase text-[#7a5930]">
          Дүрслэл
        </h3>

        <div className="grid grid-cols-3 gap-4">
          {forms.map((form) => {
            const active = selectedForm?.type === form.type;

            return (
              <button
                key={form.type}
                type="button"
                onClick={() => setSelectedFormType(form.type)}
                className="flex flex-col items-center gap-2 font-balsamiq font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8920a] focus-visible:ring-offset-2"
              >
                <div
                  className={[
                    "flex items-center justify-center rounded-full border-2",
                    compact ? "h-16 w-16" : "h-20 w-20",
                    active
                      ? "border-[#e8920a] bg-[#fff2d6]"
                      : "border-[#ead9bb] bg-[#fffdf7]",
                  ].join(" ")}
                >
                  {/* <span className="mongol-script text-2xl text-[#3b2f2f]">
                    {form.glyph}
                  </span> */}
                  <span
                    className="mongol-script text-2xl text-[#3b2f2f]"
                    style={{
                      unicodeBidi: "isolate",
                      display: "inline-block",
                    }}
                  >
                    {form.glyph}
                  </span>
                </div>

                <span className={active ? "text-[#c97806]" : "text-[#7a5930]"}>
                  {FORM_LABELS[form.type]}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section
        className={[
          "rounded-2xl border border-[#ead9bb] bg-[#fffdf7]",
          compact ? "mb-5 p-4" : "mb-8 p-6",
        ].join(" ")}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-balsamiq text-sm font-bold text-[#3b2f2f]">
            Бичиглэл
          </h3>
        </div>

        <div
          className={[
            "flex items-center justify-center rounded-[20px] bg-white",
            compact ? "h-32" : "h-48",
          ].join(" ")}
        >
          {selectedForm?.strokePath ? (
            <StrokeAnimation
              path={selectedForm.strokePath}
              play={play}
              viewBox={selectedForm.viewBox ?? "0 0 21 49"}
            />
          ) : (
            <span className="text-sm text-[#a98958]">No stroke data</span>
          )}
        </div>
      </section>
    </div>
  );
};
