
import { z } from "zod";

export const registerOrganizationSchema = z.object({
  organizationName: z
    .string()
    .trim()
    .min(2, "Organization name must be at least 2 characters")
    .max(120),

  adminName: z
    .string()
    .trim()
    .min(2, "Admin name must be at least 2 characters")
    .max(100),

  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .toLowerCase(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password is too long"),
});

export const loginSchema = z.object({
  email: z.string().trim().email().toLowerCase(),

  password: z.string().min(1, "Password is required"),
});
