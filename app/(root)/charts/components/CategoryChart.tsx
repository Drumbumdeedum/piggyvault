"use client";

import CustomBarChart from "@/components/dashboard/CustomBarChart";

const CategoryChart = (chartData: any) => {
  return (
    <div>
      <CustomBarChart
        items={chartData.chartData.map((data: { label: any; amount: any }) => {
          return {
            label: data.label,
            value: data.amount,
          };
        })}
      />
    </div>
  );
};

export default CategoryChart;
