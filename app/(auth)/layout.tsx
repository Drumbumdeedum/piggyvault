import ProductPreviewImage from "@/components/auth/ProductPreviewImage";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen w-full justify-between font-inter">
      {children}
      <div className="flex h-screen w-full sticky top-0 items-center justify-end bg-blue-100 max-lg:hidden">
        <ProductPreviewImage />
      </div>
    </main>
  );
}
