import Image from "next/image";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen w-full justify-between font-inter">
      {children}
      <div className="flex h-screen w-full sticky top-0 items-center justify-end bg-blue-100 max-lg:hidden">
        <div>
          <Image
            src="/images/placeholders/product_image_placeholder.svg"
            width={500}
            height={500}
            alt="Product preview"
          />
        </div>
      </div>
    </main>
  );
}
