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
    let result;
    const requisitions = await findRequisitionsForUserByInstitution({
      userId,
      institutionId,
    });

    if (!requisitions) {
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
      const requisition = await getRequistion({
        requisitionId: requisitions[0].id,
        accessToken,
      });
      if (requisition.status === "CR") {
        result = requisition;
      } else {
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
      }
    }

    return result;
  } catch (error) {
    console.log("Error making requisition request.", error);
    return;
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
    if (!response.ok) {
      console.log("Error creating requisition.");
      return;
    }
    return await response.json();
  } catch (error) {
    console.log("Error creating requisition.", error);
    return;
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
