import PersonalDataForm from "@/components/PersonalDataForm";
import PreferencesData from "@/components/PreferencesData";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getLoggedInUser } from "@/lib/actions/auth.actions";
import InitUser from "@/lib/stores/InitUser";

const page = async () => {
  const user = await getLoggedInUser();
  if (!user) return;
  return (
    <>
      <InitUser user={user} />
      <Card className="w-full">
        <CardContent className="flex flex-row py-5">
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Personal data</h1>
            <p>Update personal data</p>
          </div>
          <PersonalDataForm />
        </CardContent>
        <CardContent>
          <Separator />
        </CardContent>
        <CardContent className="flex flex-row py-5">
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Preferences</h1>
            <p>Manage your app preferences</p>
          </div>
          <PreferencesData />
        </CardContent>
      </Card>
    </>
  );
};

export default page;
