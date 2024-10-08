"use server";

import {
  readAccountBalanceById,
  updateAccountCurrentBalanceById,
} from "../accounts/db.actions";

export const updateSavingsBalance = async ({
  account_id,
  amount,
}: {
  account_id: string;
  amount: number;
}) => {
  const dbAccount = await readAccountBalanceById(account_id);
  if (dbAccount) {
    const updatedAccount = await updateAccountCurrentBalanceById({
      id: account_id,
      current_balance: dbAccount.current_balance + amount,
    });
  }
};
