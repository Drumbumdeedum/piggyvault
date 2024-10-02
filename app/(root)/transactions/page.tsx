import PageHeader from "@/components/PageHeader";
import TransactionsTable from "@/components/TransactionsTable";
import { getLoggedInUser } from "@/lib/actions/auth.actions";

const page = async () => {
  const user = await getLoggedInUser();
  if (!user) return;
  return (
    <div className="p-5">
      <PageHeader title="Transactions" />
      <TransactionsTable user={user} />
    </div>
  );
};

export default page;
