import { z } from "zod";

export const signUpNameSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Please enter your full name.")
    .regex(
      /^[\p{L}][\p{L}\s'-]{1,49}$/u,
      "Full name can include letters, spaces, apostrophes, and hyphens only.",
    ),
  username: z
    .string()
    .trim()
    .min(1, "Please enter a username.")
    .regex(
      /^[a-zA-Z0-9_]{3,20}$/,
      "Username must be 3-20 characters and use only letters, numbers, or underscore.",
    ),
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email.")
    .email("Please enter a valid email address."),
});

export const signUpPasswordSchema = z
  .object({
    password: z.string().min(8, "Use at least 8 characters for your password."),
    confirmPassword: z.string(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export const ageSchema = z.coerce
  .number()
  .refine((value) => Number.isFinite(value) && value > 0, {
    message: "Please enter a valid age.",
  });

export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email.")
    .email("Please enter a valid email address."),
  password: z.string().min(1, "Please enter your password."),
});
