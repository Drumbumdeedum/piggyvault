"use server";

import { getLoggedInUser } from "../auth.actions";
import {
  createCashAccount,
  readCashAccountsByUserId,
  readCashAccountsByUserIdAndCurrency,
  updateCashAccountCurrentBalance,
} from "./db.actions";

export const addCashBalance = async ({
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
