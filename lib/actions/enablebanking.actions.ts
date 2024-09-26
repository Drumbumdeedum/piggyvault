"use server";

import { getBaseHeaders } from "@/utils/enablebanking/client";
import { encodedRedirect } from "@/utils/utils";
import { getLoggedInUser } from "./auth.actions";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { filterDuplicates } from "../utils";

const { ENABLE_BANKING_REDIRECT_URI, ENABLE_BANKING_BASE_URL } = process.env;

export const listBanks = async ({ countryCode }: { countryCode: string }) => {
  const base_headers = getBaseHeaders();
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
  const base_headers = getBaseHeaders();
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

export const completeAccountConnection = async ({ code }: { code: string }) => {
  const supabase = createClient();
  const user = await getLoggedInUser();

  const { data, error } = await supabase
    .from("account_connections")
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
  const base_headers = getBaseHeaders();
  const user: User = await getLoggedInUser();

  const supabase = createClient();
  const { data, error } = await supabase
    .from("account_connections")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    console.log(error);
    return;
  }

  const allAccounts = await Promise.all(
    data.map(async (accountConnection) => {
      const session = await createOrRetrieveSession({
        user_id: user.id,
        base_headers,
        accountConnection,
      });
      const accounts = await Promise.all(
        session.accounts.map(async (accountId: any) => {
          const accountDetailsResponse = await fetch(
            `${ENABLE_BANKING_BASE_URL}/accounts/${accountId}/details`,
            {
              headers: base_headers,
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
  const allAccounts = await listAccounts();
  if (!allAccounts) return;
  const base_headers = getBaseHeaders();

  const totalBalances = await Promise.all(
    allAccounts.map(async (account) => {
      const accountBalancesResponse = await fetch(
        `${ENABLE_BANKING_BASE_URL}/accounts/${account.uid}/balances`,
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
    headers: base_headers,
    body: JSON.stringify(startAuthorizationBody),
  }
);
const startAuthorizationData = await startAuthorizationResponse.text();
console.log(`Start authorization data: ${startAuthorizationData}`);

const createSessionResponse = await fetch(
  `${ENABLE_BANKING_BASE_URL}/sessions/96373b22-691b-48ac-b528-8aad4639a180`,
  {
    method: "GET",
    headers: base_headers,
  }
);
const session = await createSessionResponse.json();
console.log(session);

// Using the first available account for the following API calls
const accountId = session.accounts[0];
const accountBalancesResponse = await fetch(
  `${ENABLE_BANKING_BASE_URL}/accounts/${accountId}/balances`,
  {
    headers: base_headers,
  }
);
const balances = await accountBalancesResponse.json();
console.log(balances);

const accountTransactionsResponse = await fetch(
  `${ENABLE_BANKING_BASE_URL}/accounts/${accountId}/transactions`,
  {
    headers: base_headers,
  }
);
const transactions = await accountTransactionsResponse.json();
console.log(transactions); */

const createOrRetrieveSession = async ({
  user_id,
  base_headers,
  accountConnection,
}: {
  user_id: string;
  base_headers: any;
  accountConnection: AccountConnection;
}) => {
  let sessionBody;
  //  If session has already been initialized retrieve it by stored session_id
  if (accountConnection.session_id) {
    const getSessionRequest = await fetch(
      `https://api.enablebanking.com/sessions/${accountConnection.session_id}`,
      {
        method: "GET",
        headers: base_headers,
      }
    );
    sessionBody = await getSessionRequest.json();
    if (sessionBody.status === "AUTHORIZED") return sessionBody;
  }

  const createSessionRequestBody = {
    code: accountConnection.auth_code,
  };
  const createSessionResponse = await fetch(
    `https://api.enablebanking.com/sessions`,
    {
      method: "POST",
      headers: base_headers,
      body: JSON.stringify(createSessionRequestBody),
    }
  );
  sessionBody = await createSessionResponse.json();
  const supabase = createClient();
  await supabase
    .from("account_connections")
    .update({
      session_id: sessionBody.session_id,
    })
    .eq("user_id", user_id)
    .select();

  return sessionBody;
};
