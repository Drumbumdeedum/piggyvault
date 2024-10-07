import { z } from "zod";

export const firstNameSchema = () =>
  z.object({
    first_name: z.string().min(3, {
      message: "Required",
    }),
  });

export const lastNameSchema = () =>
  z.object({
    last_name: z.string().min(3, {
      message: "Required",
    }),
  });
