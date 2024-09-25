import PageHeader from "@/components/PageHeader";
import { getLoggedInUser } from "@/lib/actions/auth.actions";
import SelectBank from "@/components/SelectBank";

const page = async () => {
  const user = await getLoggedInUser();

  return (
    <>
      <PageHeader
        title="Select bank"
        subtitle="Select the financial institution to link to your account"
      />
      <SelectBank userId={user.id} />
    </>
  );
};

export default page;
