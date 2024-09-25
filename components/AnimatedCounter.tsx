import React from "react";
import { CountUp } from "use-count-up";

const AnimatedCounter = ({ amount }: { amount: number }) => {
  const format = (value: number) => {
    let [integerPart, decimalPart] = value.toString().split(".");
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    if (decimalPart) {
      decimalPart = decimalPart.slice(0, 2);
    } else {
      decimalPart = "00";
    }
    return `${integerPart},${decimalPart}`;
  };
  return (
    <div className="w-full">
      HUF{" "}
      <CountUp
        isCounting
        end={amount}
        duration={1}
        decimalPlaces={2}
        decimalSeparator=","
        formatter={(value) => format(value)}
      />
    </div>
  );
};
export default AnimatedCounter;
