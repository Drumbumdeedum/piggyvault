import PageHeader from "@/components/PageHeader";
import TransactionsTable from "@/components/TransactionsTable";
import { getLoggedInUser } from "@/lib/actions/auth.actions";

const page = async () => {
  const user = await getLoggedInUser();
  if (!user) return;
  return (
    <>
      <PageHeader title="Transactions" />
      <TransactionsTable user={user} />
    </>
  );
};

export default page;
