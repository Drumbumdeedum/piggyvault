"use client";

import { listAccounts, updateAccounts } from "@/lib/actions/gocardless.actions";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const AccountsList = ({
  userId,
  accessToken,
}: {
  userId: string;
  accessToken: string;
}) => {
  const router = useRouter();
  const onClick = () => {
    router.push("/linked-accounts/country");
  };
  const [accounts, setAccounts] = useState<string[] | undefined>([]);

  useEffect(() => {
    const getAccounts = async () => {
      const accounts = await listAccounts({ userId, accessToken });
      setAccounts(accounts);
    };

    if (userId && accessToken) {
      getAccounts();
    }
  }, [userId, accessToken]);

  const sp = useSearchParams();
  useEffect(() => {
    if (sp.has("ref")) {
      const updateAndFetchAccounts = async () => {
        const result = await updateAccounts({ userId, accessToken });
        router.push("/linked-accounts");
      };
      updateAndFetchAccounts();
    }
  }, [sp]);

  return (
    <div className="flex gap-2">
      <div
        className="border rounded-sm w-64 h-36 flex items-center justify-center"
        onClick={onClick}
      >
        + Link new account
      </div>
      <div className="border rounded-sm w-64 h-36 flex items-center justify-center">
        Linked account 1
      </div>
      <div className="border rounded-sm w-64 h-36 flex items-center justify-center">
        Linked account 2
      </div>
      <div className="border rounded-sm w-64 h-36 flex items-center justify-center">
        Linked account 3
      </div>
    </div>
  );
};

export default AccountsList;
