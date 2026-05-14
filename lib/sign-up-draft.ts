/** Client-only draft between sign-up step 1 and credentials (sessionStorage). */

export const SIGN_UP_DRAFT_KEY = "mazaalai-signup-draft-v1";

export type SignUpDraft = {
  fullName: string;
  username: string;
  age: number;
};

export function readSignUpDraft(): SignUpDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SIGN_UP_DRAFT_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as SignUpDraft;
    if (
      typeof data?.fullName !== "string" ||
      typeof data?.username !== "string" ||
      typeof data?.age !== "number" ||
      !Number.isFinite(data.age)
    ) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function writeSignUpDraft(draft: SignUpDraft) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SIGN_UP_DRAFT_KEY, JSON.stringify(draft));
}

export function clearSignUpDraft() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SIGN_UP_DRAFT_KEY);
}
