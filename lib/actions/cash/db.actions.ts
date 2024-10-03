"use server";

import { createClient } from "@/utils/supabase/server";

export const readCashAccountsByUserId = async (user_id: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("user_id", user_id)
    .eq("cash_account", true);
  if (error) {
    console.log("Error while retrieving cash accounts.", error);
    return;
  }
  if (!data) {
    console.log("Error while retrieving cash accounts.");
    return;
  }
  return data as Account[];
};

export const readCashAccountsByUserIdAndCurrency = async ({
  user_id,
  currency,
}: {
  user_id: string;
  currency: string;
}) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("user_id", user_id)
    .eq("currency", currency)
    .eq("cash_account", true);
  if (error) {
    console.log("Error while retrieving cash accounts.", error);
    return;
  }
  if (!data) {
    console.log("Error while retrieving cash accounts.");
    return;
  }
  return data[0] as Account;
};

export const createCashAccount = async ({
  user_id,
  currency,
  amount,
}: {
  user_id: string;
  currency: string;
  amount: number;
}) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("accounts")
    .insert({
      user_id,
      cash_account: true,
      current_balance: amount,
      institution_name: `${currency} cash balance`,
      currency,
    })
    .select("*");

  if (error) {
    console.log("Error while creating cash accounts.", error);
    return;
  }
  if (!data) {
    console.log("Error while creating cash accounts.");
    return;
  }
  return data[0] as Account;
};

export const updateCashAccountCurrentBalance = async ({
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
    .select("*");
  if (error) {
    console.log("Error while updating account balance.", error);
    return;
  }
  if (!data) {
    console.log("Error while updating account balance.");
    return;
  }
  return data[0] as Account;
};

export const createCashTransaction = async ({
  user_id,
  amount,
  currency,
  note,
}: {
  user_id: string;
  amount: number;
  currency: string;
  note: string;
}) => {
  const supabase = createClient();
  const date = new Date();
  const bookingDate = date.toISOString().split("T")[0];
  const { data, error } = await supabase
    .from("transactions")
    .insert({
      user_id,
      transaction_amount: { amount, currency },
      credit_debit_indicator: "DBIT",
      booking_date: bookingDate,
      value_date: bookingDate,
      remittance_information: [note],
      account_id: `cash_account_${user_id}`,
    })
    .select("*");
  if (error) {
    console.log("Error while creating cash transaction.", error);
    return;
  }
  if (!data) {
    console.log("Error while creating cash transaction.");
    return;
  }
  return data[0];
};
