import { z } from "zod";

export const addAccountSchema = () =>
  z.object({
    name: z.string().min(1, {
      message: "Please enter a name",
    }),
    type: z.string().min(1, {
      message: "Please select a type",
    }),
    current_balance: z.coerce.number().min(1, {
      message: "Must be a positive number",
    }),
    currency: z.string().min(1, {
      message: "Please select a currency",
    }),
  });
