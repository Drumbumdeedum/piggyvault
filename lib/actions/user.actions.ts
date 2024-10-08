"use server";

import { createClient } from "@/utils/supabase/server";
import { parseStringify } from "../utils";
import { revalidatePath } from "next/cache";

export async function getUserById(user_id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("id", user_id);
  if (error) {
    console.log("Error fetching user from database.", error);
    return;
  }
  if (!data) {
    console.log("Error fetching user from database.");
    return;
  }
  return data[0];
}

export const updateFirstNameByUserId = async ({
  user_id,
  first_name,
}: UpdateFirstNameProps) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("users")
    .update({ first_name })
    .eq("id", user_id)
    .select("first_name");
  if (error) {
    console.log("Error updating first name.", error);
    return;
  }
  return parseStringify(data[0].first_name);
};

export const updateLastNameByUserId = async ({
  user_id,
  last_name,
}: UpdateLastNameProps) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("users")
    .update({ last_name })
    .eq("id", user_id)
    .select("last_name");
  if (error) {
    console.log("Error updating last name.", error);
    return;
  }
  return parseStringify(data[0].last_name);
};

export const updateUserSyncedAt = async (user_id: string) => {
  const supabase = createClient();
  const date = new Date();
  const dateString = date.toISOString();
  const { data, error } = await supabase
    .from("users")
    .update({ synced_at: dateString })
    .eq("id", user_id)
    .select("*");
  if (error) {
    console.log("Error updating user synced_at date.", error);
    return;
  }
  if (!data) {
    console.log("Error updating user synced_at date.");
    return;
  }
  return parseStringify(data[0]);
};

export const updateDefaultCurrencyByUserId = async ({
  user_id,
  default_currency,
}: UpdateDefaultCurrencyProps) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("users")
    .update({ default_currency })
    .eq("id", user_id)
    .select("default_currency");
  if (error) {
    console.log("Error updating default currency.", error);
    return;
  }
  return parseStringify(data[0].default_currency);
};
