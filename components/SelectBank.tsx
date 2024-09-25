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
import { usePathname } from "next/navigation";
import { ghostBanks } from "@/constants/placeholders";
import { cn } from "@/lib/utils";
import { connectAccount, listBanks } from "@/lib/actions/enablebanking.actions";

const SelectBank = ({ userId }: { userId: string }) => {
  const pathName = usePathname();
  const countryCode = pathName.split("/").pop();
  if (!countryCode) return;
  const [banks, setBanks] = useState<Bank[]>(ghostBanks);
  const [loading, setLoading] = useState<boolean>(false);
  const [bankFilter, setBankFilter] = useState<string | undefined>(undefined);

  useEffect(() => {
    const getBanks = async () => {
      setLoading(true);
      const banks = await listBanks({ countryCode });
      if (banks) {
        setBanks(banks);
        setLoading(false);
      }
    };
    getBanks();
  }, [countryCode]);

  const selectBank = async (bank: Bank) => {
    const result = await connectAccount({
      userId: userId,
      bankName: bank.name,
      countryCode: countryCode,
    });
    if (result) {
      window.open(result.url, "_self");
    }
  };

  return (
    <Command className="rounded-lg border shadow-md h-[80vh] w-[40vw]">
      <CommandInput
        value={bankFilter}
        onValueChange={setBankFilter}
        className="text-2xl p-3 h-16"
        placeholder="Select a bank"
        disabled={loading}
      />
      <CommandList className="w-full max-h-full">
        {loading && <CommandEmpty>Bank not found.</CommandEmpty>}
        <CommandGroup className="space-y-2">
          {banks.map((bank: Bank, index) => {
            return (
              <CommandItem
                key={index}
                className={cn(
                  !bank.name && !bank.logo
                    ? "cursor-not-allowed"
                    : "cursor-pointer",
                  "gap-2 p-0 border my-1 rounded-sm shadow-none pl-2"
                )}
              >
                <div
                  className="flex items-center gap-2 p-2 w-full"
                  onClick={() => selectBank(bank)}
                >
                  {bank.logo ? (
                    <Image
                      className="size-12 flex justify-center items-center object-contain rounded-sm"
                      src={bank.logo}
                      alt={bank.name}
                      width={20}
                      height={20}
                    />
                  ) : (
                    <div className="h-12 w-12 bg-muted rounded-full" />
                  )}
                  {bank.name ? (
                    <span className="text-xl flex justify-center items-center">
                      {bank.name}
                    </span>
                  ) : (
                    <span className="bg-muted h-6 w-56 rounded-sm" />
                  )}

                  <div
                    className={cn(
                      !bank.name && !bank.logo && "text-muted",
                      "flex-1 flex justify-end pr-2"
                    )}
                  >
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
