"use client";

import { ghostAccounts } from "@/constants/placeholders";
import { listAccounts } from "@/lib/actions/enablebanking.actions";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const AccountsList = () => {
  const router = useRouter();
  const onClick = () => {
    router.push("/linked-accounts/country");
  };
  const [accounts, setAccounts] = useState<Account[]>(ghostAccounts);

  useEffect(() => {
    const getAccounts = async () => {
      const accounts = await listAccounts();
      setAccounts(accounts);
    };
    getAccounts();
  }, []);

  /* const sp = useSearchParams();
  useEffect(() => {
    if (sp.has("ref")) {
      const updateAndFetchAccounts = async () => {
        const result = await updateAccounts({ userId, accessToken });
        router.push("/linked-accounts");
      };
      updateAndFetchAccounts();
    }
  }, [sp]); */

  return (
    <div className="flex gap-3">
      <div
        className="border bg-gradient-to-br from-blue-500 to-green-500 text-background shadow-lg rounded w-72 h-44 flex flex-col items-center justify-center cursor-pointer hover:scale-[101%] active:scale-[99%]"
        onClick={onClick}
      >
        <div className="w-56 flex flex-col gap-2">
          <div className="flex items-center justify-start gap-2">
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              height="30px"
              width="30px"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9 17H7A5 5 0 0 1 7 7h2"></path>
              <path d="M15 7h2a5 5 0 1 1 0 10h-2"></path>
              <line x1="8" x2="16" y1="12" y2="12"></line>
            </svg>
            <span>
              <h2 className="text-xl font-bold">Link a new account</h2>
            </span>
          </div>
          <div>
            <p className="text-xs text-justify">
              To view your transaction history and balance, please link a bank
              account.
            </p>
          </div>
        </div>
      </div>
      {accounts.map((account, index) => {
        return (
          <div
            key={index}
            className="border bg-gradient-to-br from-purple-500/80 to-pink-500/80 text-background shadow-lg rounded w-72 h-44 "
          >
            {account.product && account.currency && account.account_id.iban ? (
              <div className="flex flex-col gap-2 h-full p-6">
                <h3 className="font-semibold flex-1">{account.product}</h3>
                <div className="flex">
                  <p className="text-sm grow">{account.currency}</p>
                  <div className="flex items-center justify-end gap-1">
                    <span className="text-xs">Connected</span>
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 512 512"
                      height="20px"
                      width="20px"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill="none"
                        strokeMiterlimit="10"
                        strokeWidth="32"
                        d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"
                      ></path>
                      <path
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="32"
                        d="M352 176 217.6 336 160 272"
                      ></path>
                    </svg>
                  </div>
                </div>
                <p className="text-sm">{account.account_id.iban}</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2 h-full relative p-6">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-2 bg-primary/50 w-full h-full">
                  <div>Loading data</div>
                  <div className="h-6 w-6 border-t-2 border-r-2 animate-spin border-background rounded-full" />
                </div>
                <div className="flex-1">
                  <h3 className="bg-background h-6 w-32 rounded-sm " />
                </div>
                <p className="bg-background h-6 w-12 rounded-sm" />
                <p className="bg-background h-6 w-56 rounded-sm" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AccountsList;
