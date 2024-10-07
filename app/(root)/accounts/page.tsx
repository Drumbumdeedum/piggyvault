import AccountsTable from "@/components/AccountsTable";
import PageHeader from "@/components/layout/PageHeader";
import SidebarRight from "@/components/layout/SidebarRight";
import { Button } from "@/components/ui/button";
import { getLoggedInUser } from "@/lib/actions/auth.actions";
import InitUser from "@/lib/stores/InitUser";
import { Plus } from "lucide-react";

const page = async () => {
  const user = await getLoggedInUser();
  if (!user) return;
  return (
    <>
      <InitUser user={user} />
      <div className="flex">
        <div className="p-5 flex-1">
          <div className="flex items-center">
            <div className="flex-1">
              <PageHeader title="Accounts" subtitle="Manage your accounts" />
            </div>
            <Button>
              <Plus size="18" className="mr-2" />
              Add account
            </Button>
          </div>
          <AccountsTable />
        </div>
        <SidebarRight />
      </div>
    </>
  );
};

export default page;
