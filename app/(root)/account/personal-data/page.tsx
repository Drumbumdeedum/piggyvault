import PersonalDataForm from "@/components/PersonalDataForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getLoggedInUser } from "@/lib/actions/auth.actions";

const page = async () => {
  const user = await getLoggedInUser();
  if (!user) return;
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Personal data</CardTitle>
        <CardDescription>Update personal data</CardDescription>
      </CardHeader>
      <CardContent>
        <PersonalDataForm user={user} />
      </CardContent>
    </Card>
  );
};

export default page;
