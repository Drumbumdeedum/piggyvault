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
import { getAllBanks } from "@/lib/actions/gocardless.actions";
import { usePathname } from "next/navigation";

const SelectBank = ({ accessToken }: { accessToken: string }) => {
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
        <CommandGroup>
          {banks.map((bank: Bank, index) => {
            return (
              <CommandItem
                key={index}
                className="cursor-pointer gap-2 p-0 border-b-2 rounded-none shadow-none"
              >
                <div className="flex gap-2 p-2 w-full">
                  <Image
                    className="size-12 flex justify-center items-center"
                    src={bank.logo}
                    alt={bank.name}
                    width={40}
                    height={40}
                  />
                  <span className="text-xl flex justify-center items-center">
                    {bank.name}
                  </span>
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
