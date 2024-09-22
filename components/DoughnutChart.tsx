"use client";

import { Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const DoughnutChart = ({ accounts }: DoughnutChartProps) => {
  const mappedChartData = accounts.map((account, index) => {
    return {
      name: account.name,
      balance: account.currentBalance,
      fill: `var(--color-bank_${index + 1})`,
    };
  });

  let mappedChartConfig: ChartConfig = {};
  accounts.forEach((account, index) => {
    const key = `bank_${index + 1}` as keyof ChartConfig;
    mappedChartConfig[key] = {
      label: account.name,
      color: `hsl(var(--chart-${index + 1}))`,
    };
  });
  return (
    <div className="w-64 h-64">
      <ChartContainer
        config={mappedChartConfig}
        className="mx-auto aspect-square max-h-[250px]"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={mappedChartData}
            dataKey="balance"
            nameKey="name"
            innerRadius={60}
            strokeWidth={5}
          />
        </PieChart>
      </ChartContainer>
    </div>
  );
};

export default DoughnutChart;
