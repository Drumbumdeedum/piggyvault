"use client";

import { ghostAccounts } from "@/constants/placeholders";
import {
  completeAccountConnection,
  listAccounts,
} from "@/lib/actions/enablebanking.actions";
import { BadgeCheck, CirclePlus, LoaderPinwheel } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const AccountsList = () => {
  const router = useRouter();
  const sp = useSearchParams();
  const onClick = () => {
    router.push("/linked-accounts/country");
  };
  const [accounts, setAccounts] = useState<Account[]>(ghostAccounts);

  useEffect(() => {
    const getAccounts = async () => {
      const accounts = await listAccounts();
      console.log(accounts);
      setAccounts(accounts!);
    };
    getAccounts();
  }, []);

  useEffect(() => {
    if (sp.has("code")) {
      const connectAccount = async () => {
        await completeAccountConnection({
          code: sp.get("code")!,
        });
      };
      connectAccount();
    }
  }, [sp]);

  return (
    <div className="flex gap-3">
      <div
        className="border bg-gradient-to-br from-blue-500 to-green-500 text-background shadow-lg rounded-xl w-72 h-44 flex flex-col items-center justify-center cursor-pointer hover:scale-[101%] active:scale-[99%]"
        onClick={onClick}
      >
        <div className="w-56 flex flex-col gap-2">
          <div className="flex items-center justify-start gap-2">
            <CirclePlus size="24" />
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
            className="border bg-gradient-to-br from-purple-500/70 to-pink-500 text-background shadow-lg rounded-xl w-72 h-44 "
          >
            {account.currency && account.account_id.iban ? (
              <div className="flex flex-col gap-2 h-full p-6">
                <h3 className="font-semibold flex-1">
                  {account.product ? account.product : account.name}
                </h3>
                <div className="flex">
                  <p className="text-sm grow">{account.currency}</p>
                  <div className="flex items-center justify-end gap-1 text-green-400/90">
                    <span className="text-xs">Connected</span>
                    <BadgeCheck size="18" />
                  </div>
                </div>
                <p className="text-sm">{account.account_id.iban}</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2 h-full relative p-6">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-2 bg-primary/50 w-full h-full rounded-xl">
                  <div className="text-background">Loading data</div>
                  <LoaderPinwheel size="20" className="animate-spin" />
                </div>
                <div className="flex-1">
                  <h3 className="bg-background/20 h-6 w-32 rounded-sm " />
                </div>
                <p className="bg-background/20 h-6 w-12 rounded-sm" />
                <p className="bg-background/20 h-6 w-56 rounded-sm" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AccountsList;
