"use server";

import { revalidatePath } from "next/cache";
import { getLoggedInUser } from "../auth.actions";
import {
  createCashAccount,
  createCashTransaction,
  readCashAccountsByUserId,
  readCashAccountsByUserIdAndCurrency,
  updateCashAccountCurrentBalance,
} from "./db.actions";

export const updateCashBalance = async ({
  amount,
  currency,
}: {
  amount: number;
  currency: string;
}) => {
  const user = await getLoggedInUser();
  if (!user) return;

  let cashAccount = await readCashAccountsByUserIdAndCurrency({
    user_id: user.id,
    currency,
  });

  if (!cashAccount) {
    cashAccount = await createCashAccount({
      user_id: user.id,
      currency,
      amount,
    });
  } else {
    cashAccount = await updateCashAccountCurrentBalance({
      id: cashAccount.id,
      current_balance: (cashAccount.current_balance += amount),
    });
  }

  return { current_balance: cashAccount?.current_balance, currency: currency };
};

export const fetchCurrentCashBalance = async () => {
  const user = await getLoggedInUser();
  if (!user) return;

  const result = await readCashAccountsByUserId(user.id);

  console.log(result);

  return result;
};

export const createCashTransactionAndUpdateCashBalance = async ({
  amount,
  currency,
  note = "",
}: {
  amount: number;
  currency: string;
  note?: string;
}) => {
  const user = await getLoggedInUser();
  if (!user) return;

  const cashTransaction = await createCashTransaction({
    user_id: user.id,
    amount,
    currency,
    note,
  });

  if (cashTransaction) {
    console.log(cashTransaction);
    const updatedBalance = await updateCashBalance({
      amount: -amount,
      currency: currency,
    });
    console.log(updatedBalance);
    revalidatePath("/");
    return updatedBalance;
  }
  return null;
};
