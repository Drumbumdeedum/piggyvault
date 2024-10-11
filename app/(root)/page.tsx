import CashBalanceBox from "@/components/dashboard/CashBalanceBox";
import PageHeader from "@/components/layout/PageHeader";
import { TotalBalanceBox } from "@/components/dashboard/TotalBalanceBox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getLoggedInUser } from "@/lib/actions/auth.actions";
import InitUser from "@/lib/stores/InitUser";
import SavingsBalanceBox from "@/components/dashboard/SavingsBalanceBox";
import RecentTransactionsBox from "@/components/dashboard/RecentTransactionsBox";
import { readRecentTransactionsByUserId } from "@/lib/actions/enablebanking/db.actions";

async function getRecentTransactions(user_id: string): Promise<Transaction[]> {
  return await readRecentTransactionsByUserId(user_id);
}

export default async function Index() {
  const user: User = await getLoggedInUser();
  if (!user) return;
  const recentTransactions = await getRecentTransactions(user.id);

  return (
    <>
      <InitUser user={user} />
      <div className="no-scrollbar flex flex-1 flex-row w-full justify-center h-screen">
        <ScrollArea>
          <div className="p-5 w-full">
            <PageHeader
              title={`Welcome ${user.first_name}`}
              subtitle="Access and manage your accounts and transactions"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <div className="flex justify-center">
                <TotalBalanceBox />
              </div>
              <div className="flex justify-center">
                <RecentTransactionsBox transactions={recentTransactions} />
              </div>
              <div className="flex justify-center">
                <CashBalanceBox />
              </div>
              <div className="flex justify-center">
                <SavingsBalanceBox />
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
