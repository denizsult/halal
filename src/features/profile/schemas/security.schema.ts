import { z } from "zod";

export const securitySchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "At least one uppercase letter required")
      .regex(/[a-z]/, "At least one lowercase letter required")
      .regex(/[0-9]/, "At least one number required"),
    password_confirmation: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

export type SecurityFormData = z.infer<typeof securitySchema>;
