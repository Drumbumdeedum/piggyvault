import { getLoggedInUser } from "@/lib/actions/auth.actions";
import SelectBank from "@/components/SelectBank";
import PageHeader from "@/components/layout/PageHeader";

const page = async () => {
  const user = await getLoggedInUser();

  return (
    <div className="no-scrollbar flex w-full flex-row max-xl:max-h-screen max-xl:overflow-y-scroll">
      <div className="flex-1 p-5 w-max">
        <div className="lg:w-[46rem] mx-auto">
          <PageHeader
            title="Select bank"
            subtitle="Select the financial institution to link to your account"
          />
          <SelectBank userId={user.id} />
        </div>
      </div>
    </div>
  );
};

export default page;
