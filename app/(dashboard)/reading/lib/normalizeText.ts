const INVISIBLE_MONGOLIAN_CHARS = /[\u180b-\u180f\u200c\u200d\ufe00-\ufe0f]/g;
const SPACING_SEPARATORS = /[\u00a0\u202f]/g;
const EXTRA_PUNCTUATION = /[.,!?;:«»„“”"'\/\-–—()[\]{}<>]+/g;

export const normalizeText = (text: string): string => {
  return text
    .normalize("NFC")
    .replace(SPACING_SEPARATORS, " ")
    .replace(INVISIBLE_MONGOLIAN_CHARS, "")
    .replace(EXTRA_PUNCTUATION, " ")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
};

export const tokenizeWords = (text: string): string[] => {
  const normalized = normalizeText(text);
  return normalized.length === 0 ? [] : normalized.split(" ");
};
