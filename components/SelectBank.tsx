"use client";

import React, { useEffect, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import Image from "next/image";
import {
  connectNewAccount,
  getAllBanks,
} from "@/lib/actions/gocardless.actions";
import { usePathname } from "next/navigation";

const SelectBank = ({
  userId,
  accessToken,
}: {
  userId: string;
  accessToken: string;
}) => {
  const pathName = usePathname();
  const countryCode = pathName.split("/").pop();
  if (!countryCode) return;
  const [banks, setBanks] = useState([]);
  const [bankFilter, setBankFilter] = useState<string | undefined>(undefined);

  useEffect(() => {
    const getBanks = async () => {
      const results = await getAllBanks(accessToken, countryCode);
      setBanks(results);
    };
    getBanks();
  }, [accessToken, countryCode]);

  const selectBank = async (bank: Bank) => {
    const result = await connectNewAccount({
      userId: userId,
      accessToken: accessToken,
      institutionId: bank.id,
    });
    if (result) {
      window.open(result.link, "_blank")!.focus();
    }
  };

  return (
    <Command className="rounded-lg border shadow-md h-[80vh] w-[40vw]">
      <CommandInput
        value={bankFilter}
        onValueChange={setBankFilter}
        className="text-2xl p-3 h-16"
        placeholder="Select a bank"
      />
      <CommandList className="w-full max-h-full">
        <CommandEmpty>Bank not found.</CommandEmpty>
        <CommandGroup className="space-y-2">
          {banks.map((bank: Bank, index) => {
            return (
              <CommandItem
                key={index}
                className="cursor-pointer gap-2 p-0 border my-1 rounded-sm shadow-none pl-2"
              >
                <div
                  className="flex items-center gap-2 p-2 w-full"
                  onClick={() => selectBank(bank)}
                >
                  <Image
                    className="size-12 flex justify-center items-center rounded-full border-[1px] border-slate-200"
                    src={bank.logo}
                    alt={bank.name}
                    width={300}
                    height={300}
                  />
                  <span className="text-xl flex justify-center items-center">
                    {bank.name}
                  </span>
                  <div className="flex-1 flex justify-end pr-2">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 320 512"
                      height="16px"
                      width="16px"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"></path>
                    </svg>
                  </div>
                </div>
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

export default SelectBank;
