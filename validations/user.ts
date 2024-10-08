import { z } from "zod";

export const firstNameSchema = () =>
  z.object({
    first_name: z.string().min(3, {
      message: "Minimum 3 characters required",
    }),
  });

export const lastNameSchema = () =>
  z.object({
    last_name: z.string().min(3, {
      message: "Minimum 3 characters required",
    }),
  });

export const preferredCurrencySchema = () =>
  z.object({
    currency: z.string().min(1, {
      message: "Please select a currency",
    }),
  });
