"use server";

import { getLoggedInUser } from "../auth.actions";
import { createCashTransaction, readCashAccountsByUserId } from "./db.actions";
import {
  readAccountBalanceById,
  readAccountById,
  updateAccountCurrentBalanceById,
} from "../accounts/db.actions";

export const updateCashBalance = async ({
  account_id,
  amount,
}: {
  account_id: string;
  amount: number;
}) => {
  const dbAccount = await readAccountBalanceById(account_id);
  if (dbAccount) {
    await updateAccountCurrentBalanceById({
      id: account_id,
      current_balance: dbAccount.current_balance + amount,
    });
  }
};

export const fetchCurrentCashBalance = async () => {
  const user = await getLoggedInUser();
  if (!user) return;
  return await readCashAccountsByUserId(user.id);
};

export const createCashTransactionAndUpdateCashBalance = async ({
  account_id,
  amount,
  note = "",
}: {
  account_id: string;
  amount: number;
  note?: string;
}) => {
  const user = await getLoggedInUser();
  if (!user) return;
  const dbAccount = await readAccountById(account_id);
  console.log(account_id);
  console.log(dbAccount);
  if (!dbAccount) return;

  const cashTransaction = await createCashTransaction({
    user_id: user.id,
    amount,
    currency: dbAccount.currency,
    note,
  });
  console.log(cashTransaction);

  if (cashTransaction) {
    await updateCashBalance({
      account_id,
      amount: -amount,
    });
  }
};
