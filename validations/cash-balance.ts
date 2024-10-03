import { z } from "zod";

export const addCashBalanceSchema = () =>
  z.object({
    amount: z.coerce.number(),
    currency: z.string(),
  });
