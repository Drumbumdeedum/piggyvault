import AccountSettingsSidebar from "@/components/AccountSettingsSidebar";
import PageHeader from "@/components/PageHeader";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <PageHeader title="Account" subtitle="Manage your account" />
      <div className="flex">
        <AccountSettingsSidebar />
        {children}
      </div>
    </div>
  );
}
