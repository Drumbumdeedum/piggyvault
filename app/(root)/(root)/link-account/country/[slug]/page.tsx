import PageHeader from "@/components/PageHeader";
import { getLoggedInUser } from "@/lib/actions/auth.actions";
import SelectBank from "@/components/SelectBank";

const page = async () => {
  const user = await getLoggedInUser();

  return (
    <div className="flex-1 p-5 w-max">
      <div className="lg:w-[46rem] mx-auto">
        <PageHeader
          title="Select bank"
          subtitle="Select the financial institution to link to your account"
        />
        <SelectBank userId={user.id} />
      </div>
    </div>
  );
};

export default page;
