import SidebarRight from "@/components/SidebarRight";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="no-scrollbar flex w-full flex-row max-xl:max-h-screen max-xl:overflow-y-scroll">
      {children}
      <SidebarRight />
    </div>
  );
}
