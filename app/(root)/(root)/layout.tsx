import SidebarRight from "@/components/layout/SidebarRight";
import { getLoggedInUser } from "@/lib/actions/auth.actions";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getLoggedInUser();
  return (
    <div className="no-scrollbar flex w-full flex-row max-xl:max-h-screen max-xl:overflow-y-scroll">
      {children}
      <SidebarRight />
    </div>
  );
}
