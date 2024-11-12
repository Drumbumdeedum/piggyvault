"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getLastCharOfNumber } from "@/lib/utils";

const CustomBarChart = ({
  items,
}: {
  items: { label: string; value: number }[];
}) => {
  const mappedChartData = items.map((item, index) => {
    return {
      label: item.label,
      value: item.value,
      fill: `var(--color-category_${getLastCharOfNumber(index)})`,
    };
  });

  let mappedChartConfig: ChartConfig = {};
  items.forEach((item, index) => {
    const key = `category_${getLastCharOfNumber(index)}` as keyof ChartConfig;
    mappedChartConfig[key] = {
      label: item.label,
      color: `hsl(var(--chart-${getLastCharOfNumber(index)}))`,
    };
  });

  return (
    <ChartContainer config={mappedChartConfig}>
      <BarChart accessibilityLayer data={mappedChartData}>
        <CartesianGrid vertical={true} />
        <XAxis
          dataKey="label"
          tickLine={false}
          ticks={[""]}
          tickMargin={10}
          axisLine={false}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Bar dataKey="value" fill="hsl(var(--chart-1))" radius={8} />
      </BarChart>
    </ChartContainer>
  );
};

export default CustomBarChart;
