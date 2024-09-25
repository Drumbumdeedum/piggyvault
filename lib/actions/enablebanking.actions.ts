"use server";

import { getBaseHeaders } from "@/utils/enablebanking/client";
import { encodedRedirect } from "@/utils/utils";
import { getLoggedInUser } from "./auth.actions";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

const { ENABLE_BANKING_REDIRECT_URI, ENABLE_BANKING_BASE_URL } = process.env;

export const listBanks = async ({ countryCode }: { countryCode: string }) => {
  const baseHeaders = getBaseHeaders();
  const aspspsResponse = await fetch(
    `${ENABLE_BANKING_BASE_URL}/aspsps?country=${countryCode.toUpperCase()}`,
    {
      headers: baseHeaders,
    }
  );
  const responseBody = await aspspsResponse.json();
  if (
    responseBody.code === 422 &&
    responseBody.error === "WRONG_REQUEST_PARAMETERS"
  ) {
    return encodedRedirect(
      "error",
      "/linked-accounts/country",
      "Invalid country code."
    );
  }
  return responseBody.aspsps;
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
  const baseHeaders = getBaseHeaders();
  const validUntil = new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000);
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
      headers: baseHeaders,
      body: JSON.stringify(startAuthorizationBody),
    }
  );
  const startAuthorizationData = await startAuthorizationResponse.json();
  return startAuthorizationData;
};

export const completeAccountConnection = async ({ code }: { code: string }) => {
  const supabase = createClient();
  const user = await getLoggedInUser();

  const { data, error } = await supabase
    .from("accountConnections")
    .insert({ userId: user.id, authCode: code })
    .select();

  if (error) {
    console.log(error);
    return;
  }
  revalidatePath("/linked-accounts");
  return;
};

export const listAccounts = async () => {
  const baseHeaders = getBaseHeaders();
  const user: User = await getLoggedInUser();

  const supabase = createClient();
  const { data, error } = await supabase
    .from("accountConnections")
    .select("*")
    .eq("userId", user.id);

  if (error) {
    console.log(error);
    return;
  }

  const allAccounts = await Promise.all(
    data.map(async (accountConnection) => {
      let sessionBody;
      if (accountConnection.sessionId) {
        const getSessionRequest = await fetch(
          `https://api.enablebanking.com/sessions/${accountConnection.sessionId}`,
          {
            method: "GET",
            headers: baseHeaders,
          }
        );
        sessionBody = await getSessionRequest.json();
      } else {
        const createSessionBody = {
          code: accountConnection.authCode,
        };
        const createSessionResponse = await fetch(
          `https://api.enablebanking.com/sessions`,
          {
            method: "POST",
            headers: baseHeaders,
            body: JSON.stringify(createSessionBody),
          }
        );
        sessionBody = await createSessionResponse.json();
        await supabase
          .from("accountConnections")
          .update({
            sessionId: sessionBody.session_id,
          })
          .eq("userId", user.id)
          .eq("authCode", accountConnection.authCode)
          .select();
      }
      const accounts = await Promise.all(
        sessionBody.accounts.map(async (accountId: any) => {
          const accountDetailsResponse = await fetch(
            `${ENABLE_BANKING_BASE_URL}/accounts/${accountId}/details`,
            {
              headers: baseHeaders,
            }
          );
          return await accountDetailsResponse.json();
        })
      );

      return accounts;
    })
  );
  return allAccounts.flat() as Account[];
};

export const getTotalBalance = async () => {
  const baseHeaders = getBaseHeaders();
  const user: User = await getLoggedInUser();

  const supabase = createClient();
  const { data: accountConnections, error } = await supabase
    .from("accountConnections")
    .select("*")
    .eq("userId", user.id);

  if (error) {
    console.log(error);
    return;
  }

  const totalBalances = await Promise.all(
    accountConnections.map(async (accountConnection) => {
      const session = await createOrRetrieveSession({
        userId: user.id,
        baseHeaders,
        accountConnection,
      });

      const accountId = session.accounts[0];
      const accountBalancesResponse = await fetch(
        `${ENABLE_BANKING_BASE_URL}/accounts/${accountId}/balances`,
        {
          headers: baseHeaders,
        }
      );
      const result = await accountBalancesResponse.json();
      return result.balances;
    })
  );

  console.log(totalBalances.flat());

  return totalBalances.flat();
};

/* // 10 days ahead
const validUntil = new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000);
const startAuthorizationBody = {
  access: {
    valid_until: validUntil.toISOString(),
  },
  aspsp: {
    name: "UniCredit Bank",
    country: "HU",
  },
  state: userId,
  redirect_url: ENABLE_BANKING_REDIRECT_URI,
  psu_type: "personal",
};
const startAuthorizationResponse = await fetch(
  `${ENABLE_BANKING_BASE_URL}/auth`,
  {
    method: "POST",
    headers: baseHeaders,
    body: JSON.stringify(startAuthorizationBody),
  }
);
const startAuthorizationData = await startAuthorizationResponse.text();
console.log(`Start authorization data: ${startAuthorizationData}`);

const createSessionResponse = await fetch(
  `${ENABLE_BANKING_BASE_URL}/sessions/96373b22-691b-48ac-b528-8aad4639a180`,
  {
    method: "GET",
    headers: baseHeaders,
  }
);
const session = await createSessionResponse.json();
console.log(session);

// Using the first available account for the following API calls
const accountId = session.accounts[0];
const accountBalancesResponse = await fetch(
  `${ENABLE_BANKING_BASE_URL}/accounts/${accountId}/balances`,
  {
    headers: baseHeaders,
  }
);
const balances = await accountBalancesResponse.json();
console.log(balances);

const accountTransactionsResponse = await fetch(
  `${ENABLE_BANKING_BASE_URL}/accounts/${accountId}/transactions`,
  {
    headers: baseHeaders,
  }
);
const transactions = await accountTransactionsResponse.json();
console.log(transactions); */

const createOrRetrieveSession = async ({
  userId,
  baseHeaders,
  accountConnection,
}: {
  userId: string;
  baseHeaders: any;
  accountConnection: { sessionId: string; authCode: string };
}) => {
  let sessionBody;
  if (accountConnection.sessionId) {
    const getSessionRequest = await fetch(
      `https://api.enablebanking.com/sessions/${accountConnection.sessionId}`,
      {
        method: "GET",
        headers: baseHeaders,
      }
    );
    sessionBody = await getSessionRequest.json();
  } else {
    const createSessionBody = {
      code: accountConnection.authCode,
    };
    const createSessionResponse = await fetch(
      `https://api.enablebanking.com/sessions`,
      {
        method: "POST",
        headers: baseHeaders,
        body: JSON.stringify(createSessionBody),
      }
    );
    sessionBody = await createSessionResponse.json();
    const supabase = createClient();
    await supabase
      .from("accountConnections")
      .update({
        sessionId: sessionBody.session_id,
      })
      .eq("userId", userId)
      .select();
  }
  return sessionBody;
};
