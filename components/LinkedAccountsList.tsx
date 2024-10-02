"use client";

import {
  BadgeCheck,
  CircleAlert,
  CirclePlus,
  LoaderPinwheel,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Skeleton } from "./ui/skeleton";
import { toast } from "sonner";
import { readNonCashAccountsByUserId } from "@/lib/actions/enablebanking/db.actions";
import { completeAccountConnection } from "@/lib/actions/enablebanking/api.actions";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

const AccountsList = ({ user }: { user: User }) => {
  const router = useRouter();
  const sp = useSearchParams();
  const onClick = () => {
    router.push("/link-account");
  };
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getAccounts = async () => {
      const accounts = await readNonCashAccountsByUserId(user.id);
      setAccounts(accounts!);
      setLoading(false);
    };
    getAccounts();
  }, []);

  useEffect(() => {
    if (sp.has("code")) {
      const connectAccount = async () => {
        await completeAccountConnection({
          auth_code: sp.get("code")!,
        });
      };
      connectAccount();
    }
    if (sp.has("success")) {
      const showToast = () => {
        router.push("/");
        toast.success("Success! 🎉", {
          description: sp.get("success")!,
          action: {
            label: "Close",
            onClick: () => onCloseToastAction(),
          },
          onAutoClose: () => onCloseToastAction(),
        });
      };
      const onCloseToastAction = () => {
        router.replace("/");
      };
      showToast();
    }
  }, [sp]);

  return (
    <div className="flex flex-col gap-3">
      <div>
        {accounts.length ? (
          <h1 className="font-bold text-xl">Your linked accounts:</h1>
        ) : (
          <>
            {!loading && (
              <Alert>
                <CircleAlert className="h-4 w-4" />
                <AlertTitle className="font-bold">
                  Connect an account
                </AlertTitle>
                <AlertDescription className="text-xs">
                  Looks like you haven't connected a bank account yet. Click the
                  card below to get started!
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
      </div>
      {accounts?.map((account, index) => {
        return (
          <div
            key={index}
            className="relative border bg-gradient-to-br from-purple-500/70 to-pink-500 text-background shadow-lg rounded-xl w-72 h-44 "
          >
            <div className="flex flex-col gap-2 h-full p-6">
              <div className="flex-1">
                <h1 className="font-semibold">{account.institution_name}</h1>
                {account.product_name && (
                  <h2 className="font-semibold text-xs flex-1">
                    {account.product_name}
                  </h2>
                )}
              </div>

              <div className="flex">
                <p className="text-sm grow">{account.currency}</p>
                <div className="flex items-center justify-end gap-1 text-green-400/90">
                  <span className="text-xs">Connected</span>
                  <BadgeCheck size="18" />
                </div>
              </div>
              <p className="text-sm">{account.iban}</p>
            </div>
            <Image
              className="absolute top-0 left-0 opacity-10 object-cover h-full rounded-lg"
              src="/images/wavy_lines.webp"
              width={316}
              height={190}
              alt="lines"
            />
          </div>
        );
      })}
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
          className="absolute top-0 left-0 opacity-10 object-cover h-full rounded-lg"
          src="/images/wavy_lines.webp"
          width={316}
          height={190}
          alt="lines"
        />
      </button>
    </div>
  );
};

export default AccountsList;
