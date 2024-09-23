"use client";

import { useRouter } from "next/navigation";

const AccountsList = () => {
  const router = useRouter();
  const onClick = () => {
    router.push("/linked-accounts/country");
  };
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
