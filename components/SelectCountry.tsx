import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { goCardlessCountries } from "@/constants/goCardlessCountries";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SelectCountry = () => {
  const router = useRouter();
  const [countryFilter, setCountryFilter] = useState<string | undefined>(
    undefined
  );
  const selectCountry = async (country: Country) => {
    router.push(`/linked-accounts/country/${country.code}`);
  };
  return (
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
                className="cursor-pointer gap-2 p-0 border my-1 rounded-sm shadow-none pl-2"
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

export default SelectCountry;
