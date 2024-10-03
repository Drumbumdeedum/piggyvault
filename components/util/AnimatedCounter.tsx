import { formatAmount } from "@/lib/utils";
import { CountUp, useCountUp } from "use-count-up";

const AnimatedCounter = ({ amount }: { amount: number }) => {
  return (
    <div className="w-full">
      HUF{" "}
      <CountUp
        isCounting
        key={amount}
        end={amount}
        duration={1}
        decimalPlaces={2}
        decimalSeparator=","
        formatter={(value) => formatAmount(value)}
      />
    </div>
  );
};
export default AnimatedCounter;
