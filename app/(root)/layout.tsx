import MobileNavigation from "@/components/layout/MobileNavigation";
import Sidebar from "@/components/layout/Sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex h-screen w-full">
      <Sidebar />
      <div className="flex size-full flex-col">
        <div className="flex flex-row-reverse bg-muted-foreground/20 h-16 items-center justify-between p-5 sm:p-8 md:hidden">
          <MobileNavigation />
        </div>
        {children}
      </div>
    </main>
  );
}
