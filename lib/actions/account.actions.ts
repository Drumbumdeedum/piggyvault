"use server";

import { createClient } from "@/utils/supabase/server";
import { parseStringify } from "../utils";
import { revalidatePath } from "next/cache";

export const updateFirstName = async ({
  userId,
  firstName,
}: UpdateFirstNameRequest) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("users")
    .update({ firstName })
    .eq("id", userId)
    .select("firstName");
  if (error) {
    console.log("Error updating first name.", error);
    return;
  }
  revalidatePath("/account/personal-data");
  return parseStringify(data[0].firstName);
};

export const updateLastName = async ({
  userId,
  lastName,
}: UpdateLastNameRequest) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("users")
    .update({ lastName })
    .eq("id", userId)
    .select("lastName");
  if (error) {
    console.log("Error updating last name.", error);
    return;
  }
  revalidatePath("/account/personal-data");
  return parseStringify(data[0].lastName);
};
