import { formatAmount } from "@/lib/utils";
import { CountUp } from "use-count-up";

const AnimatedCounter = ({ amount }: { amount: number }) => {
  return (
    <div className="w-full">
      HUF{" "}
      <CountUp
        isCounting
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
