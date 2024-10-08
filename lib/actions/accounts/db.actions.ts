"use server";

import { createClient } from "@/utils/supabase/server";

export const readAccountById = async (id: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    console.log("Error while retrieving account by id.", error);
    return;
  }
  if (!data) {
    console.log("Error while retrieving account by id.");
    return;
  }
  return data as Account;
};

export const readAccountBalanceById = async (id: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("accounts")
    .select("current_balance")
    .eq("id", id)
    .single();
  if (error) {
    console.log("Error while retrieving account balance by id.", error);
    return;
  }
  if (!data) {
    console.log("Error while retrieving account balance by id.");
    return;
  }
  return data;
};

export const updateAccountCurrentBalanceById = async ({
  id,
  current_balance,
}: {
  id: string;
  current_balance: number;
}) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("accounts")
    .update({
      current_balance,
    })
    .eq("id", id)
    .select("*")
    .single();
  if (error) {
    console.log("Error while updating account current balance.", error);
    return;
  }
  if (!data) {
    console.log("Error while updating account current balance.");
    return;
  }
  return data as Account;
};

export const createNewAccount = async ({
  user_id,
  name,
  type,
  current_balance,
  currency,
}: {
  user_id: string;
  name: string;
  type: string;
  current_balance: number;
  currency: string;
}) => {
  const supabase = createClient();
  const { error } = await supabase.from("accounts").insert({
    user_id,
    institution_name: name,
    balance_name: name,
    current_balance,
    currency,
    account_type: type,
  });

  if (error) {
    console.log("Error while creating account:", error);
    return;
  }
};
