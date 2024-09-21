import "../globals.css";
import Navbar from "../../components/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <Navbar />
        <div className="flex flex-col gap-20 max-w-5xl p-5">{children}</div>
      </div>
    </main>
  );
}
