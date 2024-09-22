import GoCardlessLink from "@/components/GoCardlessLink";
import { getLoggedInUser } from "@/lib/actions/auth.actions";

const page = async ({ searchParams }: { searchParams: ConnectionResponse }) => {
  const user = await getLoggedInUser();
  // TODO USE REF FOR CONNECTION SUCCESS MESSAGE
  console.log(searchParams.ref);
  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Account page</h1>
      <GoCardlessLink user={user} />
    </div>
  );
};

export default page;
