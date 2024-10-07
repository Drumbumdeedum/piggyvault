import PageHeader from "@/components/layout/PageHeader";
import TransactionsTable from "@/components/TransactionsTable";
import { getLoggedInUser } from "@/lib/actions/auth.actions";
import InitUser from "@/lib/stores/InitUser";

const page = async () => {
  const user = await getLoggedInUser();
  if (!user) return;
  return (
    <>
      <InitUser user={user} />
      <div className="p-5">
        <PageHeader title="Transactions" />
        <TransactionsTable />
      </div>
    </>
  );
};

export default page;
