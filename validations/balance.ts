import { z } from "zod";

export const updateCashBalanceSchema = () =>
  z.object({
    amount: z.coerce.number().min(1, {
      message: "Must be a positive number",
    }),
    currency: z.string(),
    note: z.string().optional(),
  });

export const updateSavingsBalanceSchema = () =>
  z.object({
    account_id: z.string().min(1, {
      message: "Required",
    }),
    amount: z.coerce.number({ message: "Must be a positive number" }).min(1, {
      message: "Must be a positive number",
    }),
  });
