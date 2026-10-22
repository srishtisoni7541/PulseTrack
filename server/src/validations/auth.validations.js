
import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .email("Please provide a valid email")
  .max(254, "Email is too long")
  .transform((email) => email.toLowerCase());

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password cannot exceed 128 characters")
  .refine(
    (password) => !password.includes("\0"),
    "Password contains an invalid character"
  );

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name cannot exceed 100 characters"),

    email: emailSchema,

    password: passwordSchema,
  })
  .strict();

export const loginSchema = z
  .object({
    email: emailSchema,

    // Existing accounts may have passwords created under older rules.
    // Login validates the input format; registration enforces password strength.
    password: z
      .string()
      .min(1, "Password is required")
      .max(128, "Invalid credentials"),
  })
  .strict();
