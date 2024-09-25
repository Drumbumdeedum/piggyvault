"use client";

import { useEffect, useState } from "react";
import AnimatedCounter from "./AnimatedCounter";
import DoughnutChart from "./DoughnutChart";

import { getTotalBalance } from "@/lib/actions/enablebanking.actions";

export const TotalBalanceBox = () => {
  const [balances, setBalances] = useState<Balance[]>([]);
  const [totalCurrentBalance, setTotalCurrentBalance] = useState<number>(0);
  useEffect(() => {
    const fetchTotalBalance = async () => {
      const balances = await getTotalBalance();
      if (balances) {
        let totalBalance = 0;
        balances.forEach(
          (balance) =>
            (totalBalance += parseFloat(balance.balance_amount.amount))
        );
        setTotalCurrentBalance(totalBalance);
        setBalances(balances);
      }
    };
    fetchTotalBalance();
  }, []);
  return (
    <div className="relative">
      {!!balances && !!totalCurrentBalance ? (
        <>
          <div className="p-6 pb-0">
            <p className="text-sm">Total current balance:</p>
            <div className="text-xl font-bold">
              <AnimatedCounter amount={totalCurrentBalance} />
            </div>
          </div>
          <DoughnutChart balances={balances} />
        </>
      ) : (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="h-12 w-12 border-t-2 border-r-2 animate-spin border-foreground/70 rounded-full" />
        </div>
      )}
    </div>
  );
};
