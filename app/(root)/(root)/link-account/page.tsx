import PageHeader from "@/components/layout/PageHeader";
import SelectCountry from "@/components/SelectCountry";
import { getLoggedInUser } from "@/lib/actions/auth.actions";

const page = async () => {
  const user = await getLoggedInUser();
  if (!user) return;
  return (
    <div className="flex-1 p-5 w-max">
      <div className="lg:w-[46rem] mx-auto">
        <PageHeader
          title="Connect an account"
          subtitle="Connect your bank account by selecting its country of origin first."
        />
        <SelectCountry />
      </div>
    </div>
  );
};

export default page;
