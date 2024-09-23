import PageHeader from "@/components/PageHeader";

const page = async ({ searchParams }: { searchParams: ConnectionResponse }) => {
  return (
    <div>
      <PageHeader title="Account" subtitle="Manage your account" />
    </div>
  );
};

export default page;
