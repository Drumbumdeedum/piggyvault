import React from "react";
import { CountUp } from "use-count-up";

const AnimatedCounter = ({ amount }: { amount: number }) => {
  return (
    <div className="w-full">
      $
      <CountUp
        isCounting
        end={amount}
        duration={1}
        decimalPlaces={2}
        decimalSeparator=","
      />
    </div>
  );
};
export default AnimatedCounter;
