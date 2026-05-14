/** Mongolian copy: labels, headings, validation, and longer UI strings */

export const mnValidation = {
  fullNameRequired: "Бүтэн нэрээ оруулна уу.",
  fullNameFormat:
    "Зөвхөн үсэг, зай, апостроф (') болон зураас (-) ашиглана уу.",
  usernameRequired: "Хэрэглэгчийн нэрээ оруулна уу.",
  usernameFormat:
    "3–20 тэмдэгт, зөвхөн латин үсэг, тоо, доогуур зураас (_) ашиглана уу.",
  emailInvalid: "Зөв и-мэйл хаяг оруулна уу.",
  passwordMin: "Нууц үг хамгийн багадаа 8 тэмдэгт байна.",
  passwordsMismatch: "Нууц үг таарахгүй байна.",
  ageInvalid: "Насаа зөв оруулна уу.",
  signInPasswordRequired: "Нууц үгээ оруулна уу.",
  invalidInput: "Мэдээлэл буруу байна.",
  invalidPassword: "Нууц үг буруу байна.",
} as const;

export const mnLabels = {
  email: "И-мэйл",
  password: "Нууц үг",
  fullName: "Бүтэн нэр",
  username: "Хэрэглэгчийн нэр",
  confirmPassword: "Нууц үг давтах",
  age: "Нас",
  verificationCode: "Баталгаажуулах код",
} as const;

export const mnAuth = {
  emailPlaceholder: "name@example.com",
  passwordPlaceholder: "••••••••",
  signIn2faBeforeClientTrust:
    "Таны и-мэйлд баталгаажуулах код илгээлээ. Clerk-ийн ",
  signIn2faClientTrust: "Client Trust",
  signIn2faAfterClientTrustBeforeCode:
    " функц: шинэ төхөөрөмж эсвэл нууц горимын цонхонд ихэвчлэн энэ алхам шаардлагатай. Спам хавтсыг шалгаарай. Туршилтын и-мэйлд ",
  signIn2faAfterCode: " кодыг ашиглана уу.",
  verificationCodePlaceholder: "И-мэйлээс ирсэн код",
  googleSignInFailed: "Google-ээр нэвтрэхийг эхлүүлж чадсангүй.",
  secondFactorUnsupported:
    "Нэмэлт баталгаажуулалт шаардлагатай (жишээ нь authenticator). Энэ дэлгэц зөвхөн и-мэйл кодыг дэмжинэ — Google-ээр нэвтрэх эсвэл Clerk тохиргоог өөрчилнө үү.",
  signInNeedsStep: (status: string | null | undefined) =>
    `Нэвтрэхэд нэмэлт алхам шаардлагатай (${status ?? "—"}). Дахин оролдож эсвэл Google ашиглана уу.`,
  sessionCleared: "Өмнөх сесс цэвэрлэгдлээ. Дахин нэвтэрнэ үү.",
  signInFailed: "Нэвтэрч чадсангүй. И-мэйл, нууц үгээ шалгана уу.",
  enterVerificationCode: "И-мэйлээс ирсэн кодыг оруулна уу.",
  verificationIncomplete:
    "Баталгаажуулалт дуусаагүй байна. Кодоо шалгаад дахин оролдоно уу.",
  invalidOrExpiredCode: "Код буруу эсвэл хугацаа дууссан.",
  resendCodeFailed: "Код дахин илгээж чадсангүй.",
} as const;

export const mnSignUp = {
  emailVerifySent:
    "Таны и-мэйлд баталгаажуулах код илгээлээ. Үргэлжлүүлэхийн тулд оруулна уу.",
  signUpIncomplete:
    "Бүртгэл дутуу байна. Шаардлагатай баталгаажуулалтыг дуусгана уу.",
  createAccountFailed: "Бүртгэл үүсгэж чадсангүй. Дахин оролдоно уу.",
  resendVerifyFailed: "Код дахин илгээж чадсангүй.",
  verifyCodeMissing: "И-мэйлээс ирсэн кодыг оруулна уу.",
  verifyResentInfo:
    "Шинэ код илгээлээ. И-мэйл болон спам/сурталчилгааны хавтсыг шалгана уу.",
  emailVerifyHint:
    "Ирээгүй юу? Спамыг шалгана уу. Туршилтын и-мэйлд код ",
  emailVerifyHintSuffix: " кодыг ашиглана уу.",
  codePlaceholder: "6 оронтой код",
} as const;
