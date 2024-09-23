import Sidebar from "@/components/Sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex h-screen w-full">
      <Sidebar />
      <div className="flex flex-col max-w-6xl p-5">{children}</div>
    </main>
  );
}
