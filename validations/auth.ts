import { z } from "zod";

export const authFormSchema = (type: string) =>
  z.object({
    // sign up only fields
    first_name:
      type === "sign-in"
        ? z.string().optional()
        : z.string().min(3, {
            message: "Required",
          }),
    last_name:
      type === "sign-in"
        ? z.string().optional()
        : z.string().min(3, {
            message: "Required",
          }),
    email: z.string().email(),
    password: z.string().min(8, {
      message: "Password must contain at least 8 characters",
    }),
  });

export const forgotPasswordFormSchema = () =>
  z.object({
    email: z.string().email(),
  });
