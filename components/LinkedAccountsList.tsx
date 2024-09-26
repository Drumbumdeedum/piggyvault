"use client";

import {
  completeAccountConnection,
  listAccounts,
} from "@/lib/actions/enablebanking.actions";
import { BadgeCheck, CirclePlus, LoaderPinwheel } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Skeleton } from "./ui/skeleton";

const AccountsList = () => {
  const router = useRouter();
  const sp = useSearchParams();
  const onClick = () => {
    router.push("/linked-accounts/country");
  };
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getAccounts = async () => {
      const accounts = await listAccounts();
      setAccounts(accounts!);
      setLoading(false);
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
      <button
        className="group relative border bg-gradient-to-br from-blue-500 to-green-500 text-background shadow-lg rounded-xl w-72 h-44 text-left flex flex-col items-center justify-normal cursor-pointer transform will-change-transform transition-transform hover:scale-[101%] active:scale-[99%] disabled:cursor-not-allowed"
        onClick={onClick}
        disabled={loading}
      >
        {loading ? (
          <div className="flex flex-col gap-2 h-full w-full relative p-6">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-1 w-full h-full rounded-xl">
              <div className="text-background">Loading...</div>
              <LoaderPinwheel size="20" className="animate-spin" />
            </div>
            <div className="flex-1">
              <Skeleton className="h-6 w-32 " />
            </div>
            <Skeleton className="h-6 w-12" />
            <Skeleton className="h-6 w-56" />
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-2 h-full w-full p-6">
              <h3 className="font-semibold flex-1">Link a new account</h3>
              <p className="text-sm">•••</p>
              <p className="text-sm">Access transaction and balance data</p>
            </div>
            <div className="absolute top-[38%] left-1/2 transform -translate-x-1/2 -traslate-y-1/2">
              <CirclePlus
                size="44"
                className="group-hover:animate-wiggle transform will-change-transform transition-transform"
              />
            </div>
          </>
        )}
        <Image
          className="absolute top-0 left-0 opacity-50"
          src="/images/lines.png"
          width={316}
          height={190}
          alt="lines"
        />
      </button>
      {accounts.map((account, index) => {
        const cardName = account.product
          ? account.product.toLowerCase()
          : account.name.toLowerCase();
        return (
          <div
            key={index}
            className="relative border bg-gradient-to-br from-purple-500/70 to-pink-500 text-background shadow-lg rounded-xl w-72 h-44 "
          >
            <div className="flex flex-col gap-2 h-full p-6">
              <h3 className="font-semibold flex-1 capitalize">{cardName}</h3>
              <div className="flex">
                <p className="text-sm grow">{account.currency}</p>
                <div className="flex items-center justify-end gap-1 text-green-400/90">
                  <span className="text-xs">Connected</span>
                  <BadgeCheck size="18" />
                </div>
              </div>
              <p className="text-sm">{account.account_id.iban}</p>
            </div>
            <Image
              className="absolute top-0 left-0 opacity-50"
              src="/images/lines.png"
              width={316}
              height={190}
              alt="lines"
            />
          </div>
        );
      })}
    </div>
  );
};

export default AccountsList;
