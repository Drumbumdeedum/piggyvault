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
    <>
      {!!balances && !!totalCurrentBalance ? (
        <section className="flex">
          <DoughnutChart balances={balances} />
          <div className="flex flex-col items-start justify-center gap-2">
            <h2 className="text-xl font-bold">
              Connected accounts: {balances?.length}
            </h2>
            <div className="flex flex-col">
              <p className="italic text-sm">Total current balance:</p>
              <div className=" flex-center gap-2 text-3xl font-bold">
                <AnimatedCounter amount={totalCurrentBalance} />
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div className="h-12 w-12 border-t-2 border-r-2 animate-spin border-foreground/70 rounded-full" />
      )}
    </>
  );
};
