"use server";

import { parseStringify } from "../utils";
import { revalidatePath } from "next/cache";
import { supabase } from "@/utils/supabase/index";

export const updateFirstName = async ({
  user_id,
  first_name,
}: UpdateFirstNameRequest) => {
  const { data, error } = await supabase
    .from("users")
    .update({ first_name })
    .eq("id", user_id)
    .select("first_name");
  if (error) {
    console.log("Error updating first name.", error);
    return;
  }
  revalidatePath("/account/personal-data");
  return parseStringify(data[0].first_name);
};

export const updateLastName = async ({
  user_id,
  last_name,
}: UpdateLastNameRequest) => {
  const { data, error } = await supabase
    .from("users")
    .update({ last_name })
    .eq("id", user_id)
    .select("last_name");
  if (error) {
    console.log("Error updating last name.", error);
    return;
  }
  revalidatePath("/account/personal-data");
  return parseStringify(data[0].last_name);
};
