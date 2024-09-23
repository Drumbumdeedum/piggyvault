"use server";

import { createClient } from "@/utils/supabase/server";

const { GOCARDLESS_SECRET_ID, GOCARDLESS_SECRET_KEY, GOCARDLESS_REDIRECT_URI } =
  process.env;

export const getBanks = () => {};

export const createOrGetRequisition = async ({
  userId,
  accessToken,
  institutionId,
}: createOrGetRequisitionRequest) => {
  try {
    const supabase = createClient();
    let result;
    const { data, error } = await supabase
      .from("requisitions")
      .select("*")
      .eq("institutionId", institutionId)
      .eq("reference", userId);
    if (error || !data.length) {
      const requisition = await createRequisition({
        userId,
        accessToken,
        institutionId,
      });
      result = saveRequisition({
        id: requisition.id,
        accountSelection: requisition.account_selection,
        agreement: requisition.agreement,
        institutionId: requisition.institution_id,
        link: requisition.link,
        redirect: requisition.redirect,
        redirectImmediate: requisition.redirect_immediate,
        reference: requisition.reference,
        status: requisition.status,
        ssn: requisition.ssn,
        accounts: requisition.accounts,
      });
    } else {
      result = data[0];
    }
    return result;
  } catch (error) {
    throw new Error("Error making requisition request.");
  }
};

export const listAccounts = async ({
  userId,
  accessToken,
}: {
  userId: string;
  accessToken: string;
}) => {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("requisitions")
      .select()
      .eq("reference", userId);
    if (error || !data.length) throw new Error("Error fetching requisitions.");
    // TODO! loop over all requisitions if there are multiple
    const requisitionId = data[0].id;
    const bankResponse = await fetch(
      `https://bankaccountdata.gocardless.com/api/v2/requisitions/${requisitionId}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const bankResponseBody = await bankResponse.json();
    console.log("------------------");
    console.log(bankResponseBody);

    // TODO! loop over all accounts if there are multiple
    const accountId = bankResponseBody.accounts[0];
    const transactionsResponse = await fetch(
      `https://bankaccountdata.gocardless.com/api/v2/accounts/${accountId}/transactions/`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const transactionsResponseBody = await transactionsResponse.json();

    console.log("------------------");
    console.log(transactionsResponseBody);

    // TODO! loop over all accounts if there are multiple
    const balancesResponse = await fetch(
      `https://bankaccountdata.gocardless.com/api/v2/accounts/${accountId}/balances/`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const balancesResponseBody = await balancesResponse.json();
    console.log("------------------");
    console.log(balancesResponseBody);

    return bankResponseBody;
  } catch (error) {
    throw new Error("Error while fetching accounts.");
  }
};

export const getAccessToken = async () => {
  try {
    const response = await fetch(
      "https://bankaccountdata.gocardless.com/api/v2/token/new/",
      {
        method: "POST",
        body: JSON.stringify({
          secret_id: GOCARDLESS_SECRET_ID,
          secret_key: GOCARDLESS_SECRET_KEY,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }
    );
    if (!response.ok) throw new Error("Error fetching access token.");
    return await response.json();
  } catch (error) {
    throw new Error("Error fetching access token.");
  }
};

export const getAllBanks = async (accessToken: string, country: string) => {
  try {
    const response = await fetch(
      `https://bankaccountdata.gocardless.com/api/v2/institutions/?country=${country}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (!response.ok) throw new Error("Error fetching bank institution data.");
    return await response.json();
  } catch (error) {
    throw new Error("Error fetching bank institution data.");
  }
};

export const createRequisition = async ({
  userId,
  accessToken,
  institutionId,
}: createOrGetRequisitionRequest) => {
  try {
    const response = await fetch(
      "https://bankaccountdata.gocardless.com/api/v2/requisitions/",
      {
        method: "POST",
        body: JSON.stringify({
          redirect: GOCARDLESS_REDIRECT_URI,
          institution_id: institutionId,
          reference: userId,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (!response.ok) throw new Error("Error creating requisition.");
    return await response.json();
  } catch (error) {
    throw new Error("Error creating requisition.");
  }
};

export const saveRequisition = async ({
  id,
  accountSelection,
  agreement,
  institutionId,
  link,
  redirect,
  redirectImmediate,
  reference,
  status,
  ssn,
  accounts,
}: SaveRequisitionRequest) => {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("requisitions")
      .insert({
        id,
        accountSelection,
        agreement,
        institutionId,
        link,
        redirect,
        redirectImmediate,
        reference,
        status,
        ssn,
        accounts,
      })
      .select("*");
    if (error || !data || !data.length)
      throw new Error("Error saving requisition.");
    return data[0];
  } catch (error) {
    throw new Error("Error saving requisition.");
  }
};
