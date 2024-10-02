import PageHeader from "@/components/PageHeader";
import { TotalBalanceBox } from "@/components/TotalBalanceBox";
import { getLoggedInUser } from "@/lib/actions/auth.actions";

export default async function Index() {
  const user: User = await getLoggedInUser();
  if (!user) return;
  return (
    <div className="no-scrollbar flex flex-1 flex-row max-xl:max-h-screen max-xl:overflow-y-scroll">
      <div className="p-5">
        <PageHeader
          title={`Welcome ${user.first_name}`}
          subtitle="Access and manage your account and transactions"
        />
        <TotalBalanceBox user={user} />
      </div>
    </div>
  );
}
