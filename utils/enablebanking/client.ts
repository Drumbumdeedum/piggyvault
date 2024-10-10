import jwa from "jwa";
import { readFileSync } from "fs";
import path from "path";
import { createRequire } from "module";

export const getBaseHeaders = () => {
  const jsonBase64 = (data: any) => {
    return Buffer.from(JSON.stringify(data))
      .toString("base64")
      .replace("=", "");
  };

  let jsonPath = path.resolve(process.env.ENABLE_BANKING_CERT_FILE!);

  console.log("###########");
  console.log("HERE IT IS:");
  console.log(jsonPath);

  const private_key = readFileSync(jsonPath, "utf8");
  const iat = Math.floor(new Date().getTime() / 1000);
  const jwtBody = {
    iss: "enablebanking.com",
    aud: "api.enablebanking.com",
    iat: iat,
    exp: iat + 3600,
  };
  const jwt = ((exp = 3600) => {
    const header = jsonBase64({
      typ: "JWT",
      alg: "RS256",
      kid: process.env.ENABLE_BANKING_APP_ID,
    });
    const body = jsonBase64(jwtBody);
    const signature = jwa("RS256").sign(`${header}.${body}`, private_key);
    return `${header}.${body}.${signature}`;
  })();
  const base_headers = {
    Authorization: `Bearer ${jwt}`,
    "Content-type": "application/json; charset=UTF-8",
  };
  return base_headers;
};
