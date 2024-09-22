"use server";

import { revalidatePath } from "next/cache";
import { parseStringify } from "../utils";
import {
  AccountBase,
  CountryCode,
  ProcessorTokenCreateRequest,
  ProcessorTokenCreateRequestProcessorEnum,
  Products,
} from "plaid";
import { plaidClient } from "../plaid";
import { createClient } from "@/utils/supabase/server";

const { PLAID_CLIENT_ID, PLAID_SECRET, PLAID_COUNTRY_CODES } = process.env;

export const createLinkToken = async (user: User) => {
  try {
    const tokenParams = {
      client_id: PLAID_CLIENT_ID,
      secret: PLAID_SECRET,
      user: {
        client_user_id: user.id.toString(),
      },
      client_name: `${user.firstName} ${user.lastName}`,
      products: ["auth"] as Products[],
      language: "en",
      country_codes: PLAID_COUNTRY_CODES!.split(",") as CountryCode[],
    };

    const response = await plaidClient.linkTokenCreate(tokenParams);
    return parseStringify({ linkToken: response.data.link_token });
  } catch (error) {
    console.log(error);
  }
};

export const exchangePublicToken = async ({
  publicToken,
  user,
}: ExchangePublicTokenProps) => {
  try {
    // Exchange public token for access token and item ID
    const response = await plaidClient.itemPublicTokenExchange({
      client_id: PLAID_CLIENT_ID,
      secret: PLAID_SECRET,
      public_token: publicToken,
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    // Get account information from Plaid using the access token
    const accountsResponse = await plaidClient.accountsGet({
      client_id: PLAID_CLIENT_ID,
      secret: PLAID_SECRET,
      access_token: accessToken,
    });
    await Promise.all(
      accountsResponse.data.accounts.map(async (account: AccountBase) => {
        console.log("CREATING BANK FROM ACCOUNT: ", account);
        await createBankAccount({
          userId: user.id,
          bankId: itemId,
          accountId: account.account_id,
          accessToken,
          mask: account.mask,
          name: account.name,
          officialName: account.official_name,
          persistentAccountId: account.persistent_account_id,
          subtype: account.subtype,
          type: account.type,
        });
      })
    );
    return parseStringify({
      publicTokenExchange: "complete",
    });
  } catch (error) {
    console.error("An error occurred while creating exchanging token:", error);
  }
};

export const createBankAccount = async ({
  userId,
  bankId,
  accountId,
  accessToken,
  mask,
  name,
  officialName,
  persistentAccountId,
  subtype,
  type,
}: CreateBankAccountProps) => {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("banks")
      .insert({
        userId,
        bankId,
        accountId,
        accessToken,
        mask,
        name,
        officialName,
        persistentAccountId,
        subtype,
        type,
      })
      .select("*");

    if (error) {
      console.error(error.code + " " + error.message);
      return;
    }

    console.log("CREATED BANK: ", data);
    return parseStringify(data);
  } catch (error) {
    console.log(error);
  }
};

export const getBanks = async ({ userId }: GetBanksProps) => {
  try {
    const supabase = createClient();
    const banks = await supabase.from("banks").select().eq("userId", userId);
    return parseStringify(banks.data);
  } catch (error) {
    console.log(error);
  }
};

export const getInstitution = async ({
  institutionId,
}: GetInstitutionProps) => {
  try {
    const institutionResponse = await plaidClient.institutionsGetById({
      client_id: PLAID_CLIENT_ID,
      secret: PLAID_SECRET,
      institution_id: institutionId,
      country_codes: PLAID_COUNTRY_CODES!.split(",") as CountryCode[],
    });
    const intitution = institutionResponse.data.institution;
    return parseStringify(intitution);
  } catch (error) {
    console.error("An error occurred while getting the institutions:", error);
  }
};

export const getAccounts = async ({ userId }: GetAccountsProps) => {
  try {
    // get banks from db
    const banks = await getBanks({ userId });
    const resultAccounts = await Promise.all(
      banks?.map(async (bank: Bank) => {
        // get each account info from plaid
        const accountsResponse = await plaidClient.accountsGet({
          client_id: PLAID_CLIENT_ID,
          secret: PLAID_SECRET,
          access_token: bank.accessToken,
          options: {
            account_ids: [bank.accountId],
          },
        });
        const accountData = accountsResponse.data.accounts;
        const result = await Promise.all(
          accountData.map(async (accountData) => {
            // get institution info from plaid
            const institution = await getInstitution({
              institutionId: accountsResponse.data.item.institution_id!,
            });
            const account = {
              id: accountData.account_id,
              availableBalance: accountData.balances.available!,
              currentBalance: accountData.balances.current!,
              institutionId: institution.institution_id,
              name: accountData.name,
              officialName: accountData.official_name,
              mask: accountData.mask!,
              type: accountData.type as string,
              subtype: accountData.subtype! as string,
            };
            return account;
          })
        );
        return result;
      })
    );
    const accounts = resultAccounts.flat();
    const totalBanks = accounts.length;
    const totalCurrentBalance = accounts.reduce((total, account) => {
      return total + account.currentBalance;
    }, 0);
    return parseStringify({ data: accounts, totalBanks, totalCurrentBalance });
  } catch (error) {
    console.error("An error occurred while getting the accounts:", error);
  }
};
