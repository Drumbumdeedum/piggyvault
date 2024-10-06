"use client";

import { useEffect, useState } from "react";
import AnimatedCounter from "./util/AnimatedCounter";

import { LoaderPinwheel } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { cn } from "@/lib/utils";
import CustomPieChart from "./CustomPieChart";
import { createBrowserClient } from "@supabase/ssr";
import { useAccounts } from "@/lib/stores/accounts";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const TotalBalanceBox = () => {
  const allAccounts: Account[] = useAccounts((state: any) => state.accounts);
  const [accounts, setAccounts] = useState<Account[]>(allAccounts);
  const [totalCurrentBalance, setTotalCurrentBalance] = useState<number>(0);

  useEffect(() => {
    setAccounts(allAccounts);
    setTotalCurrentBalance(
      allAccounts.reduce(
        (current, account) => current + account.current_balance,
        0
      )
    );
  }, [allAccounts]);

  useEffect(() => {
    const channel = supabase
      .channel("update_account_channel")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "accounts" },
        (payload) => {
          if (payload && payload.new) {
            setAccounts((prevAccounts) =>
              prevAccounts.map((account) => {
                return account.id === payload.new.id
                  ? {
                      ...account,
                      current_balance: payload.new.current_balance,
                    }
                  : account;
              })
            );
          }
        }
      )
      .subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, []);

  return (
    <Card className="w-72">
      <CardContent className="p-0 w-full">
        <div className="flex p-5 w-full">
          <div className="w-full">
            <p className="font-semibold">Total current balance:</p>
            <div className="text-xl font-bold">
              <AnimatedCounter amount={totalCurrentBalance} />
            </div>
            <div className="flex justify-center items-center w-full">
              <CustomPieChart
                items={accounts.map((account) => {
                  return {
                    label: account.institution_name,
                    value: account.current_balance,
                  };
                })}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
