export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex p-5">{children}</div>;
}
