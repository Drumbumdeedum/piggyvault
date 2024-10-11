import React, { useEffect, useState } from "react";
import AnimatedCounter from "../util/AnimatedCounter";

const BalanceItem = ({
  current_balance,
  currency,
  balance_name,
}: {
  current_balance: number;
  currency: string;
  balance_name?: string;
}) => {
  const [startAmount, setStartAmount] = useState<number>(0);
  useEffect(() => {
    setTimeout(() => {
      setStartAmount(current_balance);
    }, 1000);
  }, [current_balance]);
  return (
    <div className="p-3 m-1 rounded-lg bg-card text-card-foreground shadow">
      {balance_name && (
        <p className="text-xs font-semibold mb-2">{balance_name}</p>
      )}
      <div className="flex items-center justify-between">
        <p className="font-medium text-muted-foreground">{currency}</p>
        <div className="text-lg font-bold">
          <AnimatedCounter amount={current_balance} startAmount={startAmount} />
        </div>
      </div>
    </div>
  );
};

export default BalanceItem;
