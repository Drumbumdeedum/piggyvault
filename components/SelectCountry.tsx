"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { enablebankingCountries } from "@/constants/enablebankingCountries";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SelectCountry = () => {
  const router = useRouter();
  const [countryFilter, setCountryFilter] = useState<string | undefined>(
    undefined
  );
  const [loading, setLoading] = useState<boolean>(false);

  const selectCountry = async (country: Country) => {
    setLoading(true);
    router.push(`/link-account/country/${country.code}`);
    setLoading(false);
  };
  return (
    <>
      <Button onClick={() => router.push("/")} className="mb-6 flex gap-2">
        <ChevronLeft size="20" />
        Back
      </Button>
      <Command className="rounded-lg border shadow-md h-[80vh] lg:w-[46rem]">
        <CommandInput
          value={countryFilter}
          onValueChange={setCountryFilter}
          className="text-2xl p-3 h-16"
          placeholder="Select country"
          disabled={loading}
        />
        <CommandList className="w-full max-h-full">
          {!loading && <CommandEmpty>Country not found.</CommandEmpty>}

          <CommandGroup>
            {enablebankingCountries.map((country, index) => {
              return (
                <CommandItem
                  key={index}
                  className="cursor-pointer gap-2 p-0 border my-1 rounded-sm shadow-none pl-2"
                  disabled={loading}
                >
                  <div
                    className="flex gap-2 p-2 justify-left items-center w-full"
                    onClick={() => selectCountry(country)}
                  >
                    <div className="text-3xl flex justify-center items-center">
                      {country.icon}
                    </div>
                    <span className="text-xl flex justify-center items-center">
                      {country.name}
                    </span>
                    <div className="flex-1 flex justify-end pr-2">
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

export default SelectCountry;
