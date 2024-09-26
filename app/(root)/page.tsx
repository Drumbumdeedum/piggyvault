import PageHeader from "@/components/PageHeader";
import { TotalBalanceBox } from "@/components/TotalBalanceBox";
import { Card } from "@/components/ui/card";
import WelcomeDialog from "@/components/WelcomeDialog";
import { getLoggedInUser } from "@/lib/actions/auth.actions";

export default async function Index() {
  const user: User = await getLoggedInUser();
  if (!user) return;
  return (
    <>
      <main>
        <WelcomeDialog user={user} />
        <PageHeader
          title={`Welcome ${user.first_name} ${user.last_name}`}
          subtitle="Access and manage your account and transactions"
        />
        <Card className="flex flex-col lg:flex-row gap-5 p-6">
          <TotalBalanceBox />
          <Card>
            <div className="p-6">Expenses this month</div>
          </Card>
          <Card>
            <div className="p-6">Incomes this month</div>
          </Card>
          <Card>
            <div className="p-6">Recent transactions</div>
          </Card>
        </Card>
      </main>
    </>
  );
}
