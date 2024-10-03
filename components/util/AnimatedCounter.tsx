import { formatAmount } from "@/lib/utils";
import { CountUp } from "use-count-up";

const AnimatedCounter = ({
  amount,
  startAmount = 0,
}: {
  amount: number;
  startAmount?: number;
}) => {
  return (
    <div className="w-full">
      HUF{" "}
      <CountUp
        isCounting
        key={amount}
        end={amount}
        start={startAmount}
        duration={1}
        decimalPlaces={2}
        decimalSeparator=","
        formatter={(value) => formatAmount(value)}
      />
    </div>
  );
};
export default AnimatedCounter;
