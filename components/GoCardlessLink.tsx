"use client";

import {
  createOrGetRequisition,
  getAllBanks,
} from "@/lib/actions/gocardless.actions";
import React, { useState } from "react";
import Image from "next/image";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { goCardlessCountries } from "@/constants";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

const GoCardlessLink = ({ user }: { user: User }) => {
  const [banks, setBanks] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState<Country>();
  const [selectedBank, setSelectedBank] = useState<Bank>();
  const [connectionLink, setConnectionLink] = useState<string>("");

  const selectCountry = async (country: Country) => {
    setSelectedCountry(country);
    const banks = await getAllBanks(user.accessToken, country.code);
    setBanks(banks);
  };

  const selectBank = async (bank: Bank) => {
    setSelectedBank(bank);
    const result = await createOrGetRequisition({
      userId: user.id,
      accessToken: user.accessToken,
      institutionId: bank.id,
    });
    setConnectionLink(result.link);
  };
  return (
    <div className="flex gap-6">
      <div>
        <Command className="rounded-lg border shadow-md h-[300px]">
          <CommandInput placeholder="Select country" />
          <CommandList>
            <CommandEmpty>Country not found.</CommandEmpty>
            <CommandGroup heading="Countries">
              {goCardlessCountries.map((country, index) => {
                return (
                  <CommandItem key={index} className="cursor-pointer gap-2 p-0">
                    <div
                      className={cn(
                        selectedCountry?.name === country.name &&
                          "bg-secondary-foreground rounded-sm",
                        "flex gap-2 p-2 w-full"
                      )}
                      onClick={() => selectCountry(country)}
                    >
                      <div
                        className="relative size-5"
                        dangerouslySetInnerHTML={{ __html: country.icon }}
                      />
                      <span
                        className={cn(
                          selectedCountry?.name === country.name
                            ? "text-secondary"
                            : "text-primary"
                        )}
                      >
                        {country.name}
                      </span>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
      {!!banks.length && (
        <div>
          <Command className="rounded-lg border shadow-md h-[300px]">
            <CommandInput placeholder="Select bank" />
            <CommandList>
              <CommandEmpty>Bank not found.</CommandEmpty>
              <CommandGroup heading="Banks">
                {banks.map((bank: Bank, index) => {
                  return (
                    <CommandItem
                      key={index}
                      className="cursor-pointer gap-2 p-0"
                    >
                      <div
                        className={cn(
                          selectedBank?.name === bank.name &&
                            "bg-secondary-foreground rounded-sm",
                          "flex gap-2 p-2 w-full"
                        )}
                        onClick={() => selectBank(bank)}
                      >
                        <Image
                          src={bank.logo}
                          alt={bank.name}
                          width={20}
                          height={20}
                        />
                        <div
                          className={cn(
                            selectedBank?.name === bank.name
                              ? "text-secondary"
                              : "text-primary"
                          )}
                        >
                          {bank.name}
                        </div>
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
      {connectionLink && selectedBank && (
        <div>
          <div>{selectedBank.name}</div>
          <div>
            <Image
              src={selectedBank.logo}
              alt={selectedBank.name}
              width={20}
              height={20}
            />
          </div>
          <a href={connectionLink} target="_blank">
            <Button>Connect account</Button>
          </a>
        </div>
      )}
    </div>
  );
};

export default GoCardlessLink;
