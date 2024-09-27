"use client";

import { Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getLastCharOfNumber } from "@/lib/utils";

const DoughnutChart = ({
  items,
}: {
  items: { label: string; value: number }[];
}) => {
  const mappedChartData = items.map((item, index) => {
    return {
      name: item.label,
      balance: item.value,
      fill: `var(--color-bank_${getLastCharOfNumber(index)})`,
    };
  });

  let mappedChartConfig: ChartConfig = {};
  items.forEach((item, index) => {
    const key = `bank_${getLastCharOfNumber(index)}` as keyof ChartConfig;
    mappedChartConfig[key] = {
      label: item.label,
      color: `hsl(var(--chart-${getLastCharOfNumber(index)}))`,
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
