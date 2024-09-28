import PageHeader from "@/components/PageHeader";
import { TotalBalanceBox } from "@/components/TotalBalanceBox";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import WelcomeDialog from "@/components/WelcomeDialog";
import { getLoggedInUser } from "@/lib/actions/auth.actions";

export default async function Index() {
  const user: User = await getLoggedInUser();
  if (!user) return;
  return (
    <>
      <main>
        <WelcomeDialog user={user} />
        <Card>
          <CardHeader>
            <PageHeader
              title={`Welcome ${user.first_name}`}
              subtitle="Access and manage your account and transactions"
            />
          </CardHeader>
          <CardContent className="flex flex-col lg:flex-row gap-5 p-6 items-center justify-center">
            <TotalBalanceBox user={user} />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
