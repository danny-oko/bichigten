import { z } from "zod";

import { mnValidation } from "@/lib/i18n/mn-copy";

/** Trim + email format (empty and invalid both use the same message). */
const emailField = z.string().trim().email({ error: mnValidation.emailInvalid });

export const signUpNameSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, mnValidation.fullNameRequired)
    .regex(
      /^[\p{L}][\p{L}\s'-]{1,49}$/u,
      mnValidation.fullNameFormat,
    ),
  username: z
    .string()
    .trim()
    .min(1, mnValidation.usernameRequired)
    /** Matches Clerk default username rules (length + Latin letters, digits, underscore). */
    .regex(
      /^[a-zA-Z0-9_]{4,64}$/,
      mnValidation.usernameFormat,
    ),
  email: emailField,
});

export const signUpPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, mnValidation.passwordMin)
      .max(10, mnValidation.passwordMax),
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: mnValidation.passwordsMismatch,
  });

const ageFromString = z
  .string()
  .trim()
  .min(1, mnValidation.ageInvalid)
  .refine((s) => /^\d{1,3}$/.test(s), { message: mnValidation.ageInvalid })
  .transform((s) => Number.parseInt(s, 10))
  .refine((n) => n >= 5 && n <= 120, { message: mnValidation.ageInvalid });

/** Sign-up step 1: name, username, age (typed in). */
export const signUpStep1Schema = z.object({
  fullName: signUpNameSchema.shape.fullName,
  username: signUpNameSchema.shape.username,
  age: ageFromString,
});

/** Sign-up step 2: email + password. */
export const signUpCredentialsSchema = z
  .object({
    email: emailField,
    password: z
      .string()
      .min(8, mnValidation.passwordMin)
      .max(10, mnValidation.passwordMax),
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: mnValidation.passwordsMismatch,
  });

export const signInSchema = z.object({
  email: emailField,
  password: z.string().min(1, mnValidation.signInPasswordRequired),
});
