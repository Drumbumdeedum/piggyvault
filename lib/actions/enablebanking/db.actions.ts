"use server";

import { createClient } from "@/utils/supabase/server";

export const readAccountsByUserId = async ({
  user_id,
}: {
  user_id: string;
}) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("user_id", user_id);
  if (error) {
    console.log(error);
    return;
  }
  return data as Account[];
};

export const readNonCashAccountsByUserId = async ({
  user_id,
}: {
  user_id: string;
}) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("user_id", user_id)
    .eq("cash_account", false);
  if (error) {
    console.log(error);
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
    .eq("auth_code", auth_code);

  if (error) {
    console.log("Error while retrieving account_connection", error);
    return;
  }
  if (!data) {
    console.log("Error while retrieving account_connection", error);
    return;
  }
  return data[0];
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
    .select();

  if (error) {
    console.log("Error while creating account connection:", error);
    return;
  }
  if (!data) {
    console.log("Error while creating account connection:", error);
    return;
  }
  return data[0];
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
  cash_account = false,
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
    cash_account,
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
    .select("*");
  if (error) {
    console.log("Error while updating account balance.", error);
    return;
  }
  if (!data) {
    console.log("Error while updating account balance.", error);
    return;
  }
  return data[0];
};
