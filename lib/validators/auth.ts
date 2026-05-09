import { z } from "zod";

import { mnValidation } from "@/lib/i18n/mn-copy";

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
  email: z
    .string()
    .trim()
    .min(1, mnValidation.emailRequired)
    .email(mnValidation.emailInvalid),
});

export const signUpPasswordSchema = z
  .object({
    password: z.string().min(8, mnValidation.passwordMin),
    confirmPassword: z.string(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ["confirmPassword"],
    message: mnValidation.passwordsMismatch,
  });

export const ageSchema = z.coerce
  .number()
  .refine((value) => Number.isFinite(value) && value > 0, {
    message: mnValidation.ageInvalid,
  });

export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, mnValidation.signInEmailRequired)
    .email(mnValidation.emailInvalid),
  password: z.string().min(1, mnValidation.signInPasswordRequired),
});
