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
    .regex(
      /^[a-zA-Z0-9_]{3,20}$/,
      mnValidation.usernameFormat,
    ),
  email: emailField,
});

export const signUpPasswordSchema = z
  .object({
    password: z.string().min(8, mnValidation.passwordMin),
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: mnValidation.passwordsMismatch,
  });

export const ageSchema = z.coerce
  .number()
  .refine((value) => Number.isFinite(value) && value > 0, {
    message: mnValidation.ageInvalid,
  });

export const signInSchema = z.object({
  email: emailField,
  password: z.string().min(1, mnValidation.signInPasswordRequired),
});
