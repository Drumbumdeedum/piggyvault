"use server";

import { getCompositeId } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";

export const readAccountsByUserId = async (user_id: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("user_id", user_id)
    .order("current_balance", { ascending: false });
  if (error) {
    console.log("Error while retrieving accounts by user_id.", error);
    return;
  }
  if (!data) {
    console.log("Error while retrieving accounts by user_id.");
    return;
  }
  return data as Account[];
};

export const readBankAccountsByUserId = async (user_id: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("user_id", user_id)
    .eq("account_type", "bank_account")
    .order("created_at", { ascending: true });
  if (error) {
    console.log("Error while retrieving bank accounts by user_id.", error);
    return;
  }
  if (!data) {
    console.log("Error while retrieving bank accounts by user_id.");
    return;
  }
  return data as Account[];
};

export const updateAccountConnectionSessionIdByUserIdAndAuthCode = async ({
  user_id,
  auth_code,
  session_id,
}: {
  user_id: string;
  auth_code: string;
  session_id: string;
}) => {
  const supabase = createClient();
  await supabase
    .from("account_connections")
    .update({
      session_id,
    })
    .eq("user_id", user_id)
    .eq("auth_code", auth_code)
    .select("*");
};

export const readAccountConnectionByUserIdAndAuthCode = async ({
  user_id,
  auth_code,
}: {
  user_id: string;
  auth_code: string;
}) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("account_connections")
    .select("*")
    .eq("user_id", user_id)
    .eq("auth_code", auth_code)
    .single();

  if (error) {
    console.log("Error while retrieving account_connection", error);
    return;
  }
  if (!data) {
    console.log("Error while retrieving account_connection");
    return;
  }
  return data;
};

export const createAccountConnection = async ({
  user_id,
  auth_code,
}: {
  user_id: string;
  auth_code: string;
}) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("account_connections")
    .insert({ user_id: user_id, auth_code })
    .select()
    .single();

  if (error) {
    console.log("Error while creating account connection:", error);
    return;
  }
  if (!data) {
    console.log("Error while creating account connection:");
    return;
  }
  return data;
};

export const createAccount = async ({
  user_id,
  institution_name,
  country,
  product_name,
  currency,
  iban,
  account_uid,
  account_id,
  account_type = "bank_account",
}: CreateAccountProps) => {
  const supabase = createClient();
  const { error } = await supabase.from("accounts").insert({
    user_id,
    institution_name,
    country,
    product_name,
    currency,
    iban,
    account_uid,
    account_id,
    account_type,
  });

  if (error) {
    console.log("Error while creating account:", error);
    return;
  }
};

export const updateAccountBalanceAndBalanceName = async ({
  user_id,
  account_id,
  current_balance,
  balance_name,
}: UpdateAccountBalanceProps) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("accounts")
    .update({
      current_balance,
      balance_name,
    })
    .eq("user_id", user_id)
    .eq("account_id", account_id)
    .select("*")
    .single();
  if (error) {
    console.log("Error while updating account balance.", error);
    return;
  }
  if (!data) {
    console.log("Error while updating account balance.");
    return;
  }
  return data;
};

export const updateAccountSyncedAt = async (id: string) => {
  const date = new Date();
  const dateString = date.toISOString();
  const supabase = createClient();
  const { data, error } = await supabase
    .from("accounts")
    .update({
      updated_at: dateString,
      synced_at: dateString,
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    console.log("Error while updating account sync date.", error);
    return;
  }
  if (!data) {
    console.log("Error while updating account sync date.");
    return;
  }
  return data;
};

export const createTransaction = async ({
  transaction,
  user_id,
  account_id,
}: {
  transaction: TransactionResponse;
  user_id: string;
  account_id: string;
}) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("transactions")
    .insert({
      ...transaction,
      composite_id: getCompositeId(transaction),
      user_id,
      account_id,
    })
    .select("*")
    .single();
  if (error) {
    console.log("Error while creating transaction.", error);
    return;
  }
  if (!data) {
    console.log("Error while creating transaction.");
    return;
  }
  return data;
};

export const updateTransactionStatus = async ({
  user_id,
  transaction,
}: {
  user_id: string;
  transaction: TransactionResponse;
}) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("transactions")
    .update({
      status: transaction.status,
      value_date: transaction.value_date,
      transaction_amount: transaction.value_date,
      composite_id: getCompositeId(transaction),
    })
    .eq("entry_reference", transaction.entry_reference)
    .eq("user_id", user_id)
    .select("*")
    .single();
  if (error) {
    console.log("Error while creating transaction.", error);
    return;
  }
  if (!data) {
    console.log("Error while creating transaction.");
    return;
  }
  return data;
};

export const readTransactionsByUserId = async (
  user_id: string
): Promise<Transaction[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user_id)
    .order("value_date", { ascending: false });
  if (error) {
    console.log("Error while reading transactions.", error);
    return [];
  }
  if (!data) {
    console.log("Error while reading transactions.");
    return [];
  }
  return data;
};

export const readUncategorizedTransactionsByUserId = async (
  user_id: string
): Promise<Transaction[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user_id)
    .is("category", null)
    .order("value_date", { ascending: false });
  if (error) {
    console.log("Error while reading transactions.", error);
    return [];
  }
  if (!data) {
    console.log("Error while reading transactions.");
    return [];
  }
  return data;
};

export const readRecentTransactionsByUserId = async (
  user_id: string
): Promise<Transaction[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user_id)
    .order("value_date", { ascending: false })
    .range(0, 10);
  if (error) {
    console.log("Error while reading transactions.", error);
    return [];
  }
  if (!data) {
    console.log("Error while reading transactions.");
    return [];
  }
  return data;
};

export const readLastTransactionsByAccountId = async (account_id: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("account_id", account_id)
    .order("created_at", { ascending: false });
  if (error) {
    console.log("Error while reading most recent transactions.", error);
    return;
  }
  if (!data) {
    console.log("Error while reading most recent transactions.");
    return;
  }
  return data[0];
};

export const updateTransactionCategory = async ({
  user_id,
  transaction_id,
  category,
}: {
  user_id: string;
  transaction_id: string;
  category: string;
}) => {
  const supabase = createClient();
  console.log("UPDATING TRANSACTION: ", transaction_id);
  console.log("UPDATING CATEGORY: ", category);
  const { data, error } = await supabase
    .from("transactions")
    .update({ category })
    .eq("id", transaction_id)
    .eq("user_id", user_id)
    .select("*")
    .single();
  if (error) {
    console.log("Error while updating transaction category.", error);
    return;
  }
  if (!data) {
    console.log("Error while updating transaction category.");
    return;
  }
  console.log(data);
};

export const readTransactionByEntryReference = async (
  entry_reference: string
) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("entry_reference", entry_reference)
    .single();
  if (error) {
    console.log("Error while reading transaction by entry reference.", error);
    return;
  }
  return data;
};
