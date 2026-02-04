import { z } from "zod";

export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^[0-9]+$/, "OTP must contain only numbers"),
});

export type OtpFormData = z.infer<typeof otpSchema>;

export const emailSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

export type EmailFormData = z.infer<typeof emailSchema>;
