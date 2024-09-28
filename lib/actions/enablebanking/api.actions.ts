"use server";

import { getBaseHeaders } from "@/utils/enablebanking/client";
import { encodedRedirect } from "@/utils/utils";
import { getLoggedInUser } from "../auth.actions";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { filterDuplicates } from "../../utils";
import {
  createAccount,
  createAccountConnection,
  readAccountConnectionByUserIdAndAuthCode,
  readAccountsByUserId,
  readNonCashAccountsByUserId,
  updateAccountBalanceAndBalanceName,
  updateAccountConnectionSessionIdByUserIdAndAuthCode,
} from "./db.actions";

const { ENABLE_BANKING_REDIRECT_URI, ENABLE_BANKING_BASE_URL } = process.env;
const base_headers = getBaseHeaders();

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
  const { id: user_id } = await getLoggedInUser();

  let account_connection = await readAccountConnectionByUserIdAndAuthCode({
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
      await createAccount({
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

      await updateAccountTotalBalance({ user_id, account_id });
    })
  );
  revalidatePath("/linked-accounts");
  return encodedRedirect(
    "success",
    "/settings/linked-accounts",
    "Your account is now connected."
  );
};

export const updateAllAccountsTotalBalances = async () => {
  const { id: user_id }: User = await getLoggedInUser();
  const allAccounts = await readAccountsByUserId(user_id);
  if (!allAccounts || !user_id) return;
  const resultAccounts: Account[][] = await Promise.all(
    allAccounts.map(async (account) => {
      return updateAccountTotalBalance({
        user_id,
        account_id: account.account_id,
      });
    })
  );
  return resultAccounts.flat();
};

const updateAccountTotalBalance = async ({
  user_id,
  account_id,
}: {
  user_id: string;
  account_id: string;
}) => {
  const accountBalancesResponse: BalanceResponse[] =
    await getAccountTotalBalances(account_id);
  return await Promise.all(
    accountBalancesResponse.map(async (balance: BalanceResponse) => {
      return await updateAccountBalanceAndBalanceName({
        user_id,
        account_id,
        current_balance: parseFloat(balance.balance_amount.amount),
        balance_name: balance.name,
      });
    })
  );
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
    await updateAccountConnectionSessionIdByUserIdAndAuthCode({
      user_id,
      session_id: postSessionBody.session_id,
      auth_code,
    });
  }
  const getSessionPromise = await getSession(current_session_id);
  const getSessionBody: GetSessionResponse = await getSessionPromise.json();
  return getSessionBody;
};

export const getBanksByCountryCode = async ({
  countryCode,
}: {
  countryCode: string;
}) => {
  const aspsps_response = await fetch(
    `${ENABLE_BANKING_BASE_URL}/aspsps?country=${countryCode.toUpperCase()}`,
    {
      method: "GET",
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
      "/settings/linked-accounts/country",
      "Invalid country code."
    );
  }
  return response_body.aspsps;
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

const getAccountDetails = (account_id: string) => {
  return fetch(`${ENABLE_BANKING_BASE_URL}/accounts/${account_id}/details`, {
    method: "GET",
    headers: base_headers,
  });
};

const getAccountTotalBalances = async (
  account_id: string
): Promise<BalanceResponse[]> => {
  const accountBalancesResponse = await fetch(
    `${ENABLE_BANKING_BASE_URL}/accounts/${account_id}/balances`,
    {
      method: "GET",
      headers: base_headers,
    }
  );
  if (!accountBalancesResponse.ok) {
    console.log(
      `Error ${accountBalancesResponse.status} while fetching account balances.`
    );
  }
  const accountBalancesResponseBody: BalancesResponse =
    await accountBalancesResponse.json();
  // For some reason the enablebanking API sometimes return the exact same balance twice,
  // due to this we have to filter out duplicates using a deepEqual function here
  const balances: BalanceResponse[] = filterDuplicates(
    accountBalancesResponseBody.balances
  );
  return balances;
};

export const fetchTransactionsByUserId = async (user_id: string) => {
  const accounts = await readNonCashAccountsByUserId(user_id);
  if (!accounts) {
    return;
  }
  const transactions = await Promise.all(
    accounts?.map(async (account) => {
      const accountTransactions = await getTransactions(account.account_id);
      return accountTransactions.transactions;
    })
  );

  //const transaction = await getTransactionDetails();

  return transactions.flat();
};

const getTransactions = async (
  account_id: string
): Promise<TransactionsResponse> => {
  const accountTransactionsResponse = await fetch(
    `${ENABLE_BANKING_BASE_URL}/accounts/${account_id}/transactions`,
    {
      method: "GET",
      headers: base_headers,
    }
  );
  if (!accountTransactionsResponse.ok) {
    console.log(
      `Error ${accountTransactionsResponse.status} while fetching account transactions.`
    );
  }
  return await accountTransactionsResponse.json();
};

const getTransactionDetails = async ({
  account_id,
  transaction_id,
}: {
  account_id: string;
  transaction_id: string;
}): Promise<TransactionResponse> => {
  const transactionDetailsResponse = await fetch(
    `${ENABLE_BANKING_BASE_URL}/accounts/${account_id}/transactions/${transaction_id}`,
    {
      method: "GET",
      headers: base_headers,
    }
  );
  if (!transactionDetailsResponse.ok) {
    console.log(
      `Error ${transactionDetailsResponse.status} while fetching transaction details.`
    );
  }
  return await transactionDetailsResponse.json();
};
