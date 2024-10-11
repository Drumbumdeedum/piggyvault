import CashBalanceBox from "@/components/CashBalanceBox";
import PageHeader from "@/components/layout/PageHeader";
import SavingsBalanceBox from "@/components/SavingsBalanceBox";
import { TotalBalanceBox } from "@/components/TotalBalanceBox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getLoggedInUser } from "@/lib/actions/auth.actions";
import InitUser from "@/lib/stores/InitUser";

export default async function Index() {
  const user: User = await getLoggedInUser();
  if (!user) return;

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
