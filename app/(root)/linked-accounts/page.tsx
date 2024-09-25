import LinkedAccountsList from "@/components/LinkedAccountsList";
import PageHeader from "@/components/PageHeader";
import { getLoggedInUser } from "@/lib/actions/auth.actions";

const page = async () => {
  const user: User = await getLoggedInUser();
  if (!user) return;
  return (
    <>
      <PageHeader
        title="Linked accounts"
        subtitle="Manage your linked bank accounts"
      />
      <LinkedAccountsList />
    </>
  );
};

export default page;
