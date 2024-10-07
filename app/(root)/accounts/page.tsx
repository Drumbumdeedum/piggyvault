import AccountsTable from "@/components/AccountsTable";
import AddAccountDialog from "@/components/AddAccountDialog";
import PageHeader from "@/components/layout/PageHeader";
import SidebarRight from "@/components/layout/SidebarRight";
import { Button } from "@/components/ui/button";
import { getLoggedInUser } from "@/lib/actions/auth.actions";
import InitUser from "@/lib/stores/InitUser";
import { Plus } from "lucide-react";
import { useState } from "react";

const page = async () => {
  const user = await getLoggedInUser();
  if (!user) return;

  return (
    <>
      <InitUser user={user} />

      <div className="flex">
        <div className="p-5 flex-1">
          <PageHeader title="Accounts" subtitle="Manage your accounts" />
          <AccountsTable />
        </div>
        <SidebarRight />
      </div>
    </>
  );
};

export default page;
