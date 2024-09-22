"use server";

const { GOCARDLESS_SECRET_ID, GOCARDLESS_SECRET_KEY, GOCARDLESS_REDIRECT_URI } =
  process.env;

export const getBanks = () => {};

export const connectAccount = async ({
  userId,
  accessToken,
  institutionId,
}: ConnectBankaccountRequest) => {
  try {
    const linkResponse = await fetch(
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
    const linkResponseBody = await linkResponse.json();
    return linkResponseBody;
  } catch (error) {
    console.log(error);
  }
};

export const listAccounts = async ({
  reference,
  accessToken,
}: {
  reference: string;
  accessToken: string;
}) => {
  try {
    const bankResponse = await fetch(
      `https://bankaccountdata.gocardless.com/api/v2/requisitions/${reference}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const bankResponseBody = await bankResponse.json();
    return bankResponseBody;
  } catch (error) {
    console.log("Error while fetching accounts.", error);
  }
};

export const getAccessToken = async () => {
  try {
    const accessTokenResponse = await fetch(
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
    return await accessTokenResponse.json();
  } catch (error) {
    throw new Error("Error while getting access token.");
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
