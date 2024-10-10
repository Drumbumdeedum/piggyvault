import PageHeader from "@/components/layout/PageHeader";
import { getLoggedInUser } from "@/lib/actions/auth.actions";
import InitUser from "@/lib/stores/InitUser";
import TransactionsDataTable from "./components/TransactionsDataTable";
import { columns } from "./components/TransactionsDataTableColumn";
import { readTransactionsByUserId } from "@/lib/actions/enablebanking/db.actions";
import { fetchTransactionsSinceLastTransaction } from "@/lib/actions/enablebanking/api.actions";

async function getData(user_id: string): Promise<Transaction[]> {
  return await readTransactionsByUserId(user_id);
}

const page = async () => {
  const user = await getLoggedInUser();
  if (!user) return;
  const data = await getData(user.id);
  fetchTransactionsSinceLastTransaction();

  return (
    <div className="p-5">
      <InitUser user={user} />
      <PageHeader title="Transactions" />
      <TransactionsDataTable columns={columns} data={data} />
    </div>
  );
};

export default page;
