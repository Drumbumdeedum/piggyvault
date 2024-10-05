import React, { useEffect, useState } from "react";
import AnimatedCounter from "./util/AnimatedCounter";

const CashBalanceItem = ({
  current_balance,
  currency,
}: {
  current_balance: number;
  currency: string;
}) => {
  const [startAmount, setStartAmount] = useState<number>(0);
  useEffect(() => {
    setTimeout(() => {
      setStartAmount(current_balance);
    }, 1000);
  }, [current_balance]);
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-card text-card-foreground shadow">
      <p className="font-medium text-muted-foreground">{currency}</p>
      <div className="text-lg font-bold">
        <AnimatedCounter amount={current_balance} startAmount={startAmount} />
      </div>
    </div>
  );
};

export default CashBalanceItem;
