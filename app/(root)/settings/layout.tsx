import AccountSettingsSidebar from "@/components/AccountSettingsSidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <AccountSettingsSidebar />
      {children}
    </div>
  );
}
