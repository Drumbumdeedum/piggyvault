"use server";

import { getBaseHeaders } from "@/utils/enablebanking/client";
import { encodedRedirect } from "@/utils/utils";
import { getLoggedInUser } from "./auth.actions";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { filterDuplicates } from "../utils";

const { ENABLE_BANKING_REDIRECT_URI, ENABLE_BANKING_BASE_URL } = process.env;
const base_headers = getBaseHeaders();

export const listBanks = async ({ countryCode }: { countryCode: string }) => {
  const aspsps_response = await fetch(
    `${ENABLE_BANKING_BASE_URL}/aspsps?country=${countryCode.toUpperCase()}`,
    {
      headers: base_headers,
    }
  );
  const response_body = await aspsps_response.json();
  if (
    response_body.code === 422 &&
    response_body.error === "WRONG_REQUEST_PARAMETERS"
  ) {
    return encodedRedirect(
      "error",
      "/linked-accounts/country",
      "Invalid country code."
    );
  }
  return response_body.aspsps;
};

export const connectAccount = async ({
  userId,
  bankName,
  countryCode,
}: {
  userId: string;
  bankName: string;
  countryCode: string;
}) => {
  const validUntilDays = 10;
  const validUntil = new Date(
    new Date().getTime() + validUntilDays * 24 * 60 * 60 * 1000
  );
  const startAuthorizationBody = {
    access: {
      valid_until: validUntil.toISOString(),
    },
    aspsp: {
      name: bankName,
      country: countryCode,
    },
    state: userId,
    redirect_url: ENABLE_BANKING_REDIRECT_URI,
    psu_type: "personal",
  };
  const startAuthorizationResponse = await fetch(
    `${ENABLE_BANKING_BASE_URL}/auth`,
    {
      method: "POST",
      headers: base_headers,
      body: JSON.stringify(startAuthorizationBody),
    }
  );
  const startAuthorizationData = await startAuthorizationResponse.json();
  return startAuthorizationData;
};

export const completeAccountConnection = async ({
  auth_code,
}: {
  auth_code: string;
}) => {
  const supabase = createClient();
  const { id: user_id } = await getLoggedInUser();

  let account_connection = await getAccountConnectionByUserIdAndAuthCode({
    user_id,
    auth_code,
  });
  if (!account_connection) {
    account_connection = await createAccountConnection({
      user_id,
      auth_code,
    });
  }

  const session: GetSessionResponse = await createOrRetrieveSession({
    user_id: user_id,
    auth_code,
    session_id: account_connection.session_id,
  });

  await Promise.all(
    session.accounts?.map(async (account_id) => {
      const accountDetailsPromise = await getAccountDetails(account_id);
      const accountDetailsResult: GetAccountDetailResponse =
        await accountDetailsPromise.json();
      await supabase.from("accounts").insert({
        user_id: user_id,
        institution_name: session.aspsp.name,
        country: session.aspsp.country,
        product_name: accountDetailsResult.details
          ? accountDetailsResult.details
          : accountDetailsResult.product,
        currency: accountDetailsResult.currency,
        iban: accountDetailsResult.account_id.iban,
        account_uid: accountDetailsResult.uid,
        account_id: account_id,
      });
    })
  );
  revalidatePath("/linked-accounts");
  return encodedRedirect(
    "success",
    "/linked-accounts",
    "Your account is now connected."
  );
};

export const listAccounts = async () => {
  const user: User = await getLoggedInUser();
  const supabase = createClient();
  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("user_id", user.id);
  if (error) {
    console.log(error);
    return;
  }
  return data as Account[];
};

export const getTotalBalance = async () => {
  const allAccounts = await listAccounts();
  if (!allAccounts) return;

  const totalBalances = await Promise.all(
    allAccounts.map(async (account) => {
      const accountBalancesResponse = await fetch(
        `${ENABLE_BANKING_BASE_URL}/accounts/${account.account_id}/balances`,
        {
          headers: base_headers,
        }
      );
      const result = await accountBalancesResponse.json();
      const filtered = filterDuplicates(result.balances);
      return filtered;
    })
  );
  return totalBalances.flat();
};

const createOrRetrieveSession = async ({
  user_id,
  auth_code,
  session_id,
}: CreateOrRetrieveSessionRequest) => {
  let current_session_id = session_id;
  if (!current_session_id) {
    const postSessionPromise = await postSession(auth_code);
    const postSessionBody: CreateSessionResponse =
      await postSessionPromise.json();
    current_session_id = postSessionBody.session_id;
    await updateAccountConnectionSessionId({
      user_id,
      session_id: postSessionBody.session_id,
      auth_code,
    });
  }
  const getSessionPromise = await getSession(current_session_id);
  const getSessionBody: GetSessionResponse = await getSessionPromise.json();
  return getSessionBody;
};

const getSession = (session_id: string) => {
  return fetch(`https://api.enablebanking.com/sessions/${session_id}`, {
    method: "GET",
    headers: base_headers,
  });
};

const postSession = (auth_code: string) => {
  const createSessionRequestBody = {
    code: auth_code,
  };
  return fetch(`https://api.enablebanking.com/sessions`, {
    method: "POST",
    headers: base_headers,
    body: JSON.stringify(createSessionRequestBody),
  });
};

const updateAccountConnectionSessionId = async ({
  user_id,
  session_id,
  auth_code,
}: {
  user_id: string;
  session_id: string;
  auth_code: string;
}) => {
  if (session_id) {
    const supabase = createClient();
    await supabase
      .from("account_connections")
      .update({
        session_id: session_id,
      })
      .eq("user_id", user_id)
      .eq("auth_code", auth_code)
      .select("*");
  }
};

const getAccountDetails = (account_id: string) => {
  return fetch(`${ENABLE_BANKING_BASE_URL}/accounts/${account_id}/details`, {
    method: "GET",
    headers: base_headers,
  });
};

const getAccountConnectionByUserIdAndAuthCode = async ({
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

const createAccountConnection = async ({
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
    console.log("Error while creating account_connection", error);
    return;
  }
  if (!data) {
    console.log("Error while creating account_connection", error);
    return;
  }
  return data[0];
};
