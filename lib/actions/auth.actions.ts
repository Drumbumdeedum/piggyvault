"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { authFormSchema } from "@/validations/auth";
import { subscribe } from "diagnostics_channel";
import { parseStringify } from "../utils";
const formSchema = authFormSchema("sign-up");

export const signUpAction = async (values: z.infer<typeof formSchema>) => {
  const { email, password, firstName, lastName } = values;
  const supabase = createClient();
  const origin = headers().get("origin");

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    const errorMessage =
      error.code === "user_already_exists"
        ? "An account with this email address already exists"
        : error.message;
    return encodedRedirect("error", "/sign-up", errorMessage);
  }

  const { error: dbUserError } = await supabase.from("users").insert({
    email,
    firstName,
    lastName,
  });

  if (dbUserError) {
    console.error(dbUserError.code + " " + dbUserError.message);
    return encodedRedirect(
      "error",
      "/sign-up",
      "Database error, please contact maintainer"
    );
  }

  return encodedRedirect("success", "/", "Thanks for signing up!");
};

export const signInAction = async (values: z.infer<typeof formSchema>) => {
  const { email, password } = values;
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = createClient();
  const origin = headers().get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password"
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return redirect("/");
};

export async function getLoggedInUser() {
  const supabase = createClient();
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const dbUser = await supabase
        .from("users")
        .select()
        .eq("email", user.email);
      if (dbUser && dbUser.data) {
        return parseStringify(dbUser.data[0]);
      }
      return null;
    }
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required"
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match"
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed"
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};
