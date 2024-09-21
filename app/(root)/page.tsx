import HomeHeader from "@/components/HomeHeader";
import TotalBalanceBox from "@/components/TotalBalanceBox";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getLoggedInUser } from "@/lib/actions/auth.actions";
import { getAccounts } from "@/lib/actions/plaid.actions";

export default async function Index() {
  const user = await getLoggedInUser();
  if (!user) return;
  const accounts = await getAccounts({ userId: user.id });
  const accountsData = accounts?.data;
  return (
    <>
      <main>
        <HomeHeader userName={`${user.firstName} ${user.lastName}`} />
        <main>
          <Card>
            <CardHeader>
              <CardTitle>Current balance</CardTitle>
            </CardHeader>
            <CardContent>
              <TotalBalanceBox
                accounts={accountsData}
                totalBanks={accounts?.totalBanks}
                totalCurrentBalance={accounts?.totalCurrentBalance}
              />
            </CardContent>
          </Card>
        </main>
      </main>
    </>
  );
}
