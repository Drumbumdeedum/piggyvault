"use server";

import { getBaseHeaders } from "@/utils/enablebanking/client";
import { encodedRedirect } from "@/utils/utils";
import { getLoggedInUser } from "../auth.actions";
import {
  filterDuplicates,
  getMonthRange,
  haveMinutesPassedSinceDate,
} from "../../utils";
import {
  createAccount,
  createAccountConnection,
  readAccountConnectionByUserIdAndAuthCode,
  readAccountsByUserId,
  readBankAccountsByUserId,
  updateAccountBalanceAndBalanceName,
  updateAccountConnectionSessionIdByUserIdAndAuthCode,
  updateAccountSyncedAt,
  createTransaction,
  readLastTransactionsByAccountId,
  readTransactionByEntryReference,
  updateTransactionStatus,
  readDebitTransactionsByUserId,
} from "./db.actions";
import { updateUserSyncedAt } from "../user.actions";
import {
  categorizeTransactions,
  getCategoryFromTransaction,
} from "../gemini/api.actions";

const { ENABLE_BANKING_REDIRECT_URI, ENABLE_BANKING_BASE_URL } = process.env;

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
  const validUntilDays = 90;
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
        account_type: "bank_account",
      });

      await getTransactionsOfPastMonths({
        user_id,
        account_id,
        nrOfMonths: 1,
      });
      await updateAccountTotalBalance({ user_id, account_id });
      await updateUserSyncedAt(user_id);
    })
  );
  return encodedRedirect(
    "success",
    "/accounts",
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
      valid_until: postSessionBody.access.valid_until,
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
  const base_headers = getBaseHeaders();
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
      "/link-account/country",
      "Invalid country code."
    );
  }
  return response_body.aspsps;
};

const getSession = (session_id: string) => {
  const base_headers = getBaseHeaders();
  return fetch(`https://api.enablebanking.com/sessions/${session_id}`, {
    method: "GET",
    headers: base_headers,
  });
};

const postSession = (auth_code: string) => {
  const base_headers = getBaseHeaders();
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
  const base_headers = getBaseHeaders();
  return fetch(`${ENABLE_BANKING_BASE_URL}/accounts/${account_id}/details`, {
    method: "GET",
    headers: base_headers,
  });
};

const getAccountTotalBalances = async (
  account_id: string
): Promise<BalanceResponse[]> => {
  const base_headers = getBaseHeaders();
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

export const syncTransactionsSinceLastTransaction = async () => {
  const user = await getLoggedInUser();
  if (!user) return;

  const accounts = await readBankAccountsByUserId(user.id);
  if (!accounts) {
    return;
  }

  let updateRequired = haveMinutesPassedSinceDate({
    date: user.synced_at,
    minutesPassed: 60,
  });

  /* const account_connections = await readAccountConnectionsByUserId(user.id);
  account_connections?.map(async (account_connection) => {
    const sessionData = await getSessionData(account_connection.session_id);
    console.log(sessionData);

    if (sessionData.status !== "AUTHORIZED") {
      createOrRetrieveSession({
        user_id: user.id,
        auth_code: account_connection.auth_code,
      });
    }
  }); */

  if (updateRequired) {
    accounts.forEach(async (account) => {
      const lastTransaction = await readLastTransactionsByAccountId(
        account.account_id
      );

      const { startDate } = getMonthRange(3);
      const date_from = lastTransaction
        ? lastTransaction.created_at
        : startDate;
      const newTransactions = await getTransactionsAfterDate({
        account_id: account.account_id,
        date_from,
      });
      newTransactions.transactions.forEach(async (transaction) => {
        if (transaction.entry_reference && transaction.status !== "BOOK") {
          const dbTransaction = await readTransactionByEntryReference(
            transaction.entry_reference
          );
          if (dbTransaction) {
            await updateTransactionStatus({
              user_id: dbTransaction.user_id,
              transaction,
            });
          } else {
            await createTransaction({
              transaction,
              user_id: user.id,
              account_id: account.account_id,
            });
          }
        } else {
          await createTransaction({
            transaction,
            user_id: user.id,
            account_id: account.account_id,
          });
        }
      });
      await updateAccountTotalBalance({
        account_id: account.account_id,
        user_id: user.id,
      });
    });
    await updateUserSyncedAt(user.id);
  }
};

export const fetchAndUpdateTransactions = async (user_id: string) => {
  const accounts = await readBankAccountsByUserId(user_id);
  if (!accounts) {
    return;
  }
  const transactions = await Promise.all(
    accounts?.map(async (account) => {
      let accountTransactions = await getAndSyncTransactions({
        account_id: account.account_id,
        synced_at: account.synced_at,
      });

      Promise.all(
        accountTransactions.transactions.map(
          async (transaction: TransactionResponse) => {
            await createTransaction({
              transaction,
              user_id,
              account_id: account.account_id,
            });
          }
        )
      );
      return accountTransactions.transactions;
    })
  );
  return transactions.flat();
};

const getTransactionsOfPastMonths = async ({
  user_id,
  account_id,
  nrOfMonths = 1,
}: {
  user_id: string;
  account_id: string;
  nrOfMonths: number;
}) => {
  Promise.all(
    Array(nrOfMonths)
      .fill(0)
      .map(async (_, i) => {
        const { startDate, endDate } = getMonthRange(i);
        let search_params = new URLSearchParams([
          ["date_from", startDate],
          ["date_to", endDate],
        ]).toString();

        const result = await getAndSyncTransactions({
          account_id,
          search_params,
        });
        Promise.all(
          result.transactions.map(async (transaction: TransactionResponse) => {
            const category = await getCategoryFromTransaction(transaction);
            await createTransaction({
              transaction,
              user_id,
              account_id: account_id,
              category,
            });
          })
        );
        await updateAccountSyncedAt(account_id);
      })
  );
};

const getAndSyncTransactions = async ({
  account_id,
  synced_at,
  search_params,
}: {
  account_id: string;
  synced_at?: string;
  search_params?: string;
}): Promise<TransactionsResponse> => {
  let params = search_params;
  if (!search_params) {
    let now = new Date();
    if (synced_at) {
      now = new Date(synced_at);
    }
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = "01";
    const startDate = `${year}-${month}-${day}`;
    const end = new Date();
    const endDate = end.toISOString().split("T")[0];
    params = new URLSearchParams([
      ["date_from", startDate],
      ["date_to", endDate],
    ]).toString();
  }
  return await getTransactions({
    account_id,
    search_params: params,
  });
};

const getTransactionsAfterDate = async ({
  account_id,
  date_from,
}: {
  account_id: string;
  date_from: string;
}) => {
  const fromDate = new Date(date_from);
  const year = fromDate.getFullYear();
  const month = (fromDate.getMonth() + 1).toString().padStart(2, "0");
  const day = "01";
  const startDate = `${year}-${month}-${day}`;
  const end = new Date();
  const endDate = end.toISOString().split("T")[0];
  const search_params = new URLSearchParams([
    ["date_from", startDate],
    ["date_to", endDate],
  ]).toString();
  return await getTransactions({ account_id, search_params });
};

const getTransactions = async ({
  account_id,
  search_params,
}: {
  account_id: string;
  search_params?: string;
}): Promise<TransactionsResponse> => {
  const base_headers = getBaseHeaders();
  const accountTransactionsResponse = await fetch(
    `${ENABLE_BANKING_BASE_URL}/accounts/${account_id}/transactions?${search_params}`,
    {
      method: "GET",
      headers: base_headers,
    }
  );
  const result = await accountTransactionsResponse.json();
  if (!accountTransactionsResponse.ok) {
    console.log(
      `Error ${accountTransactionsResponse.status} while fetching account transactions.`,
      result
    );
  }
  return result;
};

const getSessionData = async (session_id: string) => {
  const base_headers = getBaseHeaders();
  const sessionDataResponse = await fetch(
    `${ENABLE_BANKING_BASE_URL}/sessions/${session_id}`,
    {
      method: "GET",
      headers: base_headers,
    }
  );
  const result = await sessionDataResponse.json();
  if (!sessionDataResponse.ok) {
    console.log(
      `Error ${sessionDataResponse.status} while fetching sesssion data.`,
      result
    );
  }
  return result;
};

export const getCategoryChartData = async (userId: string) => {
  const transactions = await readDebitTransactionsByUserId(userId);
  const grouped = transactions.reduce((acc: any, transaction) => {
    const { category, transaction_amount } = transaction;
    const amount = parseFloat(transaction_amount.amount);
    if (!acc[category]) {
      acc[category] = 0;
    }
    // TODO: refactor to use multiple currencies
    if (transaction_amount.currency === "HUF") {
      acc[category] += amount;
    }
    return acc;
  }, {});
  const groupedTransactions = Object.keys(grouped).map((category) => ({
    label: category,
    amount: grouped[category],
  }));
  return groupedTransactions.sort((a, b) => b.amount - a.amount);
};
