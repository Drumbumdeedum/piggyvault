"use server";

import { getLoggedInUser } from "../auth.actions";
import { createNewAccount } from "./db.actions";

export const addNewAccount = async ({
  name,
  type,
  current_balance,
  currency,
}: {
  name: string;
  type: string;
  current_balance: number;
  currency: string;
}) => {
  const user = await getLoggedInUser();
  if (!user) return;

  await createNewAccount({
    user_id: user.id,
    name,
    type,
    current_balance,
    currency,
  });
};
