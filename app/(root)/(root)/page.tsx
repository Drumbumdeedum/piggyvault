import CashBalanceBox from "@/components/CashBalanceBox";
import PageHeader from "@/components/layout/PageHeader";
import { TotalBalanceBox } from "@/components/TotalBalanceBox";
import { getLoggedInUser } from "@/lib/actions/auth.actions";
import InitUser from "@/lib/stores/InitUser";

export default async function Index() {
  const user: User = await getLoggedInUser();
  if (!user) return;

  return (
    <>
      <InitUser user={user} />
      <div className="no-scrollbar flex flex-1 flex-row max-xl:max-h-screen max-xl:overflow-y-scroll">
        <div className="p-5">
          <PageHeader
            title={`Welcome ${user.first_name}`}
            subtitle="Access and manage your accounts and transactions"
          />
          <div className="flex gap-5">
            <TotalBalanceBox />
            <CashBalanceBox />
          </div>
        </div>
      </div>
    </>
  );
}
