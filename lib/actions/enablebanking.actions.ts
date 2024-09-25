"use server";

import { getBaseHeaders } from "@/utils/enablebanking/client";
import { encodedRedirect } from "@/utils/utils";
import { getLoggedInUser } from "./auth.actions";

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

export const listAccounts = async () => {
  const baseHeaders = getBaseHeaders();
  const user: User = await getLoggedInUser();

  const createSessionBody = {
    code: user.enablebankingSessionCodes[0],
  };
  let createSessionResponse = await fetch(
    `https://api.enablebanking.com/sessions`,
    {
      method: "POST",
      headers: baseHeaders,
      body: JSON.stringify(createSessionBody),
    }
  );
  let sessionBody = await createSessionResponse.json();
  if (sessionBody.code === 422 && sessionBody.error === "ALREADY_AUTHORIZED") {
    const sessionId = user.enablebankingSessionIds[0];
    createSessionResponse = await fetch(
      `https://api.enablebanking.com/sessions/${sessionId}`,
      {
        method: "GET",
        headers: baseHeaders,
      }
    );
    sessionBody = await createSessionResponse.json();
  }
  const accountId = sessionBody.accounts[0];
  const accountDetailsResponse = await fetch(
    `${ENABLE_BANKING_BASE_URL}/accounts/${accountId}/details`,
    {
      headers: baseHeaders,
    }
  );
  const details = await accountDetailsResponse.json();
  const accounts = [details];
  return accounts;
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
