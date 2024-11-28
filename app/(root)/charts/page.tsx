import PageHeader from "@/components/layout/PageHeader";
import { getLoggedInUser } from "@/lib/actions/auth.actions";
import InitUser from "@/lib/stores/InitUser";
import CategoryChart from "./components/CategoryChart";
import { getCategoryChartData } from "@/lib/actions/enablebanking/api.actions";

async function getCategoryChartDataByUserId(user_id: string) {
  return await getCategoryChartData(user_id);
}

const page = async () => {
  const user = await getLoggedInUser();
  if (!user) return;
  const categoryChartData = await getCategoryChartDataByUserId(user.id);
  return (
    <>
      <InitUser user={user} />
      <div className="flex">
        <div className="p-5 flex-1">
          <PageHeader
            title="Charts"
            subtitle="Detailed transaction insights and analytics"
          />
          <CategoryChart chartData={categoryChartData} />
        </div>
      </div>
    </>
  );
};

export default page;
