"use client";

import { useEffect, useState } from "react";
import AnimatedCounter from "./AnimatedCounter";

import { LoaderPinwheel } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { cn } from "@/lib/utils";
import { readAccountsByUserId } from "@/lib/actions/enablebanking/db.actions";
import CustomPieChart from "./CustomPieChart";

export const TotalBalanceBox = ({ user }: { user: User }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [totalCurrentBalance, setTotalCurrentBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTotalBalance = async () => {
      const fetchedAccounts = await readAccountsByUserId(user.id);
      if (fetchedAccounts) {
        let totalBalance = 0;
        fetchedAccounts.forEach(
          (fetchedAccount) => (totalBalance += fetchedAccount.current_balance)
        );
        setTotalCurrentBalance(totalBalance);
        setAccounts(fetchedAccounts);
        setLoading(false);
      }
    };
    fetchTotalBalance();
  }, []);
  return (
    <Card>
      <CardContent className="p-0">
        <div className="p-6 pb-0 relative">
          <div className={cn(loading && "text-foreground/10")}>
            <p className="text-sm font-mono">Total current balance:</p>
            <div className="text-xl font-bold">
              <AnimatedCounter amount={totalCurrentBalance} />
            </div>
            <CustomPieChart
              items={accounts.map((account) => {
                return {
                  label: account.institution_name,
                  value: account.current_balance,
                };
              })}
            />
          </div>
          {loading && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-2 w-full h-full bg-muted-foreground/5 rounded-xl">
              <p>Loading data</p>
              <p>
                <LoaderPinwheel size="24" className="animate-spin" />
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
