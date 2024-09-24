"use client";

import PageHeader from "@/components/PageHeader";
import SelectCountry from "@/components/SelectCountry";

const page = () => {
  return (
    <>
      <PageHeader
        title="Select country"
        subtitle="Select the country of your financial institution"
      />
      <SelectCountry />
    </>
  );
};

export default page;
