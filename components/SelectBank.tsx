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
import { usePathname, useRouter } from "next/navigation";
import { skeletonItems } from "@/constants/placeholders";
import { cn } from "@/lib/utils";
import {
  connectAccount,
  getBanksByCountryCode,
} from "@/lib/actions/enablebanking/api.actions";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

const SelectBank = ({ userId }: { userId: string }) => {
  const router = useRouter();
  const pathName = usePathname();
  const countryCode = pathName.split("/").pop();
  if (!countryCode) return;
  const [banks, setBanks] = useState<Bank[]>(skeletonItems(20) as Bank[]);
  const [loading, setLoading] = useState<boolean>(true);
  const [bankFilter, setBankFilter] = useState<string | undefined>(undefined);

  useEffect(() => {
    const getBanks = async () => {
      setLoading(true);
      const banks = await getBanksByCountryCode({ countryCode });
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
    <>
      <Button
        onClick={() => router.push("/link-account")}
        className="mb-6 flex gap-2"
      >
        <ChevronLeft size="20" />
        Back
      </Button>
      <Command className="rounded-lg border shadow-md h-[70vh] lg:w-[46rem]">
        <CommandInput
          value={bankFilter}
          onValueChange={setBankFilter}
          className="text-2xl p-3 h-16"
          placeholder="Select a bank"
          disabled={loading}
        />
        <CommandList className="w-full max-h-full">
          {!loading && <CommandEmpty>Bank not found.</CommandEmpty>}
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
                      <Skeleton className="h-12 w-12 rounded-full" />
                    )}
                    {bank.name ? (
                      <span className="text-xl flex justify-center items-center">
                        {bank.name}
                      </span>
                    ) : (
                      <Skeleton className="h-6 w-56" />
                    )}

                    <div
                      className={cn(
                        !bank.name && !bank.logo && "text-muted",
                        "flex-1 flex justify-end pr-2"
                      )}
                    >
                      <ChevronRight size="18" />
                    </div>
                  </div>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </Command>
    </>
  );
};

export default SelectBank;
