import Sidebar from "@/components/layout/Sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col w-full">{children}</div>
    </main>
  );
}
