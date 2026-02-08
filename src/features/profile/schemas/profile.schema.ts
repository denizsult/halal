import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
  phone: z.string().max(20).optional().or(z.literal("")),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
