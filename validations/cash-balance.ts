import { z } from "zod";

export const updateCashBalanceSchema = () =>
  z.object({
    amount: z.coerce.number().min(1, {
      message: "Must be a positive number",
    }),
    currency: z.string(),
    note: z.string().optional(),
  });
