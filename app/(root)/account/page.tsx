import GoCardlessLink from "@/components/GoCardlessLink";
import PageHeader from "@/components/PageHeader";
import { getLoggedInUser } from "@/lib/actions/auth.actions";

const page = async ({ searchParams }: { searchParams: ConnectionResponse }) => {
  const user = await getLoggedInUser();
  // TODO USE REF FOR CONNECTION SUCCESS MESSAGE
  console.log(searchParams.ref);
  return (
    <div>
      <PageHeader title="Account" />
      <GoCardlessLink user={user} />
    </div>
  );
};

export default page;
