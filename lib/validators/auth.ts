import { z } from "zod";

import { mnValidation } from "@/lib/i18n/mn-copy";

/** Trim + email format (empty and invalid both use the same message). */
const emailField = z.string().trim().email({ error: mnValidation.emailInvalid });

const fullNameField = z
  .string()
  .trim()
  .min(1, mnValidation.fullNameRequired)
  .regex(/^[\p{L}][\p{L}\s'-]{1,49}$/u, mnValidation.fullNameFormat);

const usernameField = z
  .string()
  .trim()
  .min(1, mnValidation.usernameRequired)
  .regex(/^[a-zA-Z0-9_]{3,20}$/, mnValidation.usernameFormat);

const ageStringField = z
  .string()
  .trim()
  .min(1, mnValidation.ageInvalid)
  .regex(/^\d{1,3}$/, mnValidation.ageInvalid)
  .refine((s) => {
    const n = Number(s);
    return Number.isInteger(n) && n >= 1 && n <= 100;
  }, mnValidation.ageInvalid);

export const signUpNameSchema = z.object({
  fullName: fullNameField,
  username: usernameField,
  email: emailField,
});

/** Step 1: display name, username, typed age (no email). */
export const signUpProfileStepSchema = z.object({
  fullName: fullNameField,
  username: usernameField,
  age: ageStringField,
});

/** Step 2: email + password pair. */
export const signUpAccountStepSchema = z
  .object({
    email: emailField,
    password: z.string().min(8, mnValidation.passwordMin),
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: mnValidation.passwordsMismatch,
  });

export const ageSchema = z.coerce
  .number()
  .refine(
    (value) => Number.isFinite(value) && value >= 1 && value <= 100,
    { message: mnValidation.ageInvalid },
  );

export const signInSchema = z.object({
  email: emailField,
  password: z.string().min(1, mnValidation.signInPasswordRequired),
});
