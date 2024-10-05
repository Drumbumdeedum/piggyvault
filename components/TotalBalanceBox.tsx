"use client";

import { useEffect, useState } from "react";
import AnimatedCounter from "./util/AnimatedCounter";

import { LoaderPinwheel } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { cn } from "@/lib/utils";
import CustomPieChart from "./CustomPieChart";
import { fetchAccountsByUserId } from "@/lib/actions/enablebanking/api.actions";
import { createBrowserClient } from "@supabase/ssr";
import { useUser } from "@/lib/stores/user";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const TotalBalanceBox = () => {
  const user = useUser((state: any) => state.user);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [totalCurrentBalance, setTotalCurrentBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

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

  useEffect(() => {
    const fetchTotalBalance = async () => {
      const fetchedAccounts = await fetchAccountsByUserId(user.id);
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
    if (user) {
      fetchTotalBalance();
    }
  }, [user]);

  return (
    <Card className="w-72">
      <CardContent className="p-0 w-full">
        <div className="relative flex p-5 w-full">
          <div className={cn(loading && "text-foreground/10", "w-full")}>
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
