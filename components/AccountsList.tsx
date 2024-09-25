"use client";

import { ghostAccounts } from "@/constants/placeholders";
import { listAccounts } from "@/lib/actions/enablebanking.actions";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const AccountsList = ({ userId }: { userId: string }) => {
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

    if (userId) {
      getAccounts();
    }
  }, [userId]);

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
        className="border bg-primary-foreground shadow-lg rounded w-72 h-44 flex items-center justify-center"
        onClick={onClick}
      >
        + Link new account
      </div>
      {accounts.map((account, index) => {
        return (
          <div
            key={index}
            className="border bg-primary-foreground shadow-lg rounded w-72 h-44 "
          >
            {account.product && account.currency && account.account_id.iban ? (
              <div className="flex flex-col gap-2 h-full p-6">
                <h3 className="font-semibold flex-1">{account.product}</h3>
                <p className="text-sm">{account.currency}</p>
                <p className="text-sm">{account.account_id.iban}</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2 h-full relative p-6">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-2 bg-primary/50 w-full h-full">
                  <div>Loading data</div>
                  <div className="h-6 w-6 border-t-2 border-r-2 animate-spin border-black rounded-full" />
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
