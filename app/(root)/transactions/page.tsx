import PageHeader from "@/components/layout/PageHeader";
import TransactionsTable from "@/components/TransactionsTable";

const page = async () => {
  return (
    <div className="p-5">
      <PageHeader title="Transactions" />
      <TransactionsTable />
    </div>
  );
};

export default page;
