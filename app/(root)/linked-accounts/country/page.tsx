"use client";

import PageHeader from "@/components/PageHeader";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { goCardlessCountries } from "@/constants";
import { useRouter } from "next/navigation";
import { useState } from "react";

const page = () => {
  const router = useRouter();
  const [countryFilter, setCountryFilter] = useState<string | undefined>(
    undefined
  );
  const selectCountry = async (country: Country) => {
    router.push(`/linked-accounts/country/${country.code}`);
  };
  return (
    <>
      <PageHeader
        title="Select country"
        subtitle="Select the country of your financial institution"
      />
      <Command className="rounded-lg border shadow-md h-[80vh] w-[40vw]">
        <CommandInput
          value={countryFilter}
          onValueChange={setCountryFilter}
          className="text-2xl p-3 h-16"
          placeholder="Select country"
        />
        <CommandList className="w-full max-h-full">
          <CommandEmpty>Country not found.</CommandEmpty>
          <CommandGroup>
            {goCardlessCountries.map((country, index) => {
              return (
                <CommandItem
                  key={index}
                  className="cursor-pointer gap-2 p-0 border-b-2 rounded-none shadow-none"
                >
                  <div
                    className="flex gap-2 p-2 justify-left items-center w-full"
                    onClick={() => selectCountry(country)}
                  >
                    <div
                      className="size-12 flex justify-center items-center"
                      dangerouslySetInnerHTML={{ __html: country.icon }}
                    />
                    <span className="text-xl flex justify-center items-center">
                      {country.name}
                    </span>
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

export default page;
