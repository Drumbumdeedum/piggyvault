import AccountPlaidComponent from "@/components/AccountPlaidComponent";
import { getLoggedInUser } from "@/lib/actions/auth.actions";

const page = async () => {
  const user = await getLoggedInUser();
  return (
    <div>
      <h1>Account page</h1>
      <AccountPlaidComponent user={user} />
    </div>
  );
};

export default page;
