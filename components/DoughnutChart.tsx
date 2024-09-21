"use client";

import { Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { browser: "Bank1", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "Bank2", visitors: 200, fill: "var(--color-safari)" },
  { browser: "Bank3", visitors: 287, fill: "var(--color-firefox)" },
  { browser: "Bank4", visitors: 173, fill: "var(--color-edge)" },
  { browser: "Bank5", visitors: 190, fill: "var(--color-other)" },
];
const chartConfig = {
  visitors: {
    label: "Banks",
  },
  chrome: {
    label: "Bank1",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Bank2",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Bank3",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Bank4",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Bank5",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

const DoughnutChart = ({ accounts }: DoughnutChartProps) => {
  const mappedChartData = accounts.map((account) => {
    return {
      name: account.name,
      balance: account.currentBalance,
      fill: "var(--color-other)",
    };
  });
  console.log(mappedChartData);

  const mappedChartConfig = accounts.map((account) => {
    return {
      name: account.name,
      balance: account.currentBalance,
    };
  });
  return (
    <div className="w-64 h-64">
      <ChartContainer
        config={chartConfig}
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
