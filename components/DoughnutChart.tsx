"use client";

import { Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const DoughnutChart = ({ balances }: { balances: Balance[] }) => {
  const mappedChartData = balances.map((balance, index) => {
    return {
      name: balance.name,
      balance: parseFloat(balance.balance_amount.amount),
      fill: `var(--color-bank_${index + 1})`,
    };
  });

  let mappedChartConfig: ChartConfig = {};
  balances.forEach((balance, index) => {
    const key = `bank_${index + 1}` as keyof ChartConfig;
    mappedChartConfig[key] = {
      label: balance.name,
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
            paddingAngle={3}
          />
        </PieChart>
      </ChartContainer>
    </div>
  );
};

export default DoughnutChart;
