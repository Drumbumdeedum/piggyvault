import { z } from "zod";

export const firstNameSchema = () =>
  z.object({
    firstName: z.string().min(3, {
      message: "Required",
    }),
  });

export const lastNameSchema = () =>
  z.object({
    lastName: z.string().min(3, {
      message: "Required",
    }),
  });
