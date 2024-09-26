import LinkedAccountsList from "@/components/LinkedAccountsList";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getLoggedInUser } from "@/lib/actions/auth.actions";

const page = async () => {
  const user: User = await getLoggedInUser();
  if (!user) return;
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Linked accounts</CardTitle>
        <CardDescription>Manage your linked bank accounts</CardDescription>
      </CardHeader>
      <CardContent>
        <LinkedAccountsList />
      </CardContent>
    </Card>
  );
};

export default page;
