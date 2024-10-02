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
      <CardContent className="flex flex-row py-5">
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Personal data</h1>
          <p>Update personal data</p>
        </div>
        <PersonalDataForm user={user} />
      </CardContent>
    </Card>
  );
};

export default page;
