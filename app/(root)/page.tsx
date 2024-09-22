import HomeHeader from "@/components/HomeHeader";
import TotalBalanceBox from "@/components/TotalBalanceBox";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getLoggedInUser } from "@/lib/actions/auth.actions";
import { listAccounts } from "@/lib/actions/gocardless.actions";

export default async function Index() {
  const user = await getLoggedInUser();
  if (!user) return;

  const accounts = await listAccounts({
    reference: user.id,
    accessToken: user.accessToken,
  });
  if (accounts) {
    console.log(accounts);
  }
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
              <TotalBalanceBox />
            </CardContent>
          </Card>
        </main>
      </main>
    </>
  );
}
