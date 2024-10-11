export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="max-w-4xl mx-auto px-6 lg:p-0">{children}</main>;
}
