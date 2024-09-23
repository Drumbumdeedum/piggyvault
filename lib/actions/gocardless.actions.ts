"use server";

import { createClient } from "@/utils/supabase/server";
import { parseStringify } from "../utils";

const { GOCARDLESS_SECRET_ID, GOCARDLESS_SECRET_KEY, GOCARDLESS_REDIRECT_URI } =
  process.env;

export const getBanks = () => {};

export const connectNewAccount = async ({
  userId,
  accessToken,
  institutionId,
}: ConnectNewAccountRequest) => {
  const requisition = await createOrRetrieveRequisition({
    userId,
    accessToken,
    institutionId,
  });
  if (!requisition) {
    console.log("Error while connecting new account.");
    return;
  }
  return parseStringify(requisition);
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
    if (error || !data.length) {
      console.log("Error fetching requisitions.", error);
      return;
    }
    // TODO! loop over all requisitions if there are multiple
    const requisitionId = data[0].id;
    const requisitionResponse = await fetch(
      `https://bankaccountdata.gocardless.com/api/v2/requisitions/${requisitionId}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const requisitionResponseBody = await requisitionResponse.json();
    console.log("------------------");
    console.log(requisitionResponseBody);

    // TODO! loop over all accounts if there are multiple
    const accountId = requisitionResponseBody.accounts[0];
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

    return requisitionResponseBody;
  } catch (error) {
    console.log("Error while fetching accounts.");
    return;
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
    if (!response.ok) {
      console.log("Error fetching access token.");
      return;
    }
    return await response.json();
  } catch (error) {
    console.log("Error fetching access token.");
    return;
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
    if (!response.ok) {
      console.log("Error fetching bank institution data.");
      return;
    }
    return await response.json();
  } catch (error) {
    console.log("Error fetching bank institution data.");
    return;
  }
};

export const createOrRetrieveRequisition = async ({
  userId,
  accessToken,
  institutionId,
}: CreateOrGetRequisitionRequest) => {
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
  const body = await response.json();
  if (!response.ok && body.status_code === 400) {
    const savedRequisition = await findRequisitionsForUserByInstitution({
      userId,
      institutionId,
    });
    if (!savedRequisition) {
      console.log("Error while fetching requisition");
      return;
    }
    const fetchedRequisition = await getRequistion({
      accessToken,
      requisitionId: savedRequisition[0].id,
    });
    return fetchedRequisition;
  }
  saveRequisition({
    id: body.id,
    accountSelection: body.account_selection,
    agreement: body.agreement,
    institutionId: body.institution_id,
    link: body.link,
    redirect: body.redirect,
    redirectImmediate: body.redirect_immediate,
    reference: body.reference,
    status: body.status,
    ssn: body.ssn,
    accounts: body.accounts,
  });
  return body;
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
    if (error || !data || !data.length) {
      console.log("Error saving requisition.");
      return;
    }
    return data[0];
  } catch (error) {
    console.log("Error saving requisition.");
    return;
  }
};

export const findRequisitionsForUserByInstitution = async ({
  userId,
  institutionId,
}: {
  userId: string;
  institutionId: string;
}) => {
  try {
    const supabase = createClient();
    const { data, error: dbError } = await supabase
      .from("requisitions")
      .select("*")
      .eq("institutionId", institutionId)
      .eq("reference", userId);

    if (dbError) {
      console.log("Error querying requisitions.", dbError);
      return;
    }
    return data;
  } catch (error) {
    console.log("Error querying requisitions.", error);
    return;
  }
};

export const getRequistion = async ({
  requisitionId,
  accessToken,
}: {
  requisitionId: string;
  accessToken: string;
}) => {
  try {
    const response = await fetch(
      `https://bankaccountdata.gocardless.com/api/v2/requisitions/${requisitionId}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (!response.ok) {
      console.log("Error fetching requisition.");
      return;
    }
    return await response.json();
  } catch (error) {
    console.log("Error fetching requisition.", error);
    return;
  }
};
