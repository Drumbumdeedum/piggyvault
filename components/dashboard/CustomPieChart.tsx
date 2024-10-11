"use client";

import { Pie, PieChart, Tooltip } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getLastCharOfNumber } from "@/lib/utils";
import { useEffect, useLayoutEffect, useState } from "react";

const CustomPieChart = ({
  items,
}: {
  items: { label: string; value: number }[];
}) => {
  const [windowWidth, setWindowWidth] = useState<number>(0);
  useLayoutEffect(() => {
    function updateSize() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const mappedChartData = items.map((item, index) => {
    return {
      label: item.label,
      value: item.value,
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
    <div className="w-72 h-72 xl:w-48 xl:h-48 my-auto">
      <ChartContainer
        config={mappedChartConfig}
        className="mx-auto aspect-square"
      >
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Tooltip separator=" - " />
          <Pie
            data={mappedChartData}
            dataKey="value"
            nameKey="label"
            innerRadius={windowWidth >= 1280 ? 40 : 70}
            strokeWidth={3}
            paddingAngle={5}
          />
        </PieChart>
      </ChartContainer>
    </div>
  );
};

export default CustomPieChart;
