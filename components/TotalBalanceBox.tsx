"use client";

import { useEffect, useState } from "react";
import AnimatedCounter from "./util/AnimatedCounter";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import CustomPieChart from "./CustomPieChart";
import { createBrowserClient } from "@supabase/ssr";
import { useAccounts } from "@/lib/stores/accounts";
import { useUser } from "@/lib/stores/user";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const TotalBalanceBox = () => {
  const allAccounts: Account[] = useAccounts((state: any) => state.accounts);
  const default_currency = useUser((state) => state.default_currency);
  const pushAccount = useAccounts((s) => s.pushAccount);

  const [accounts, setAccounts] = useState<Account[]>(allAccounts);
  const [totalCurrentBalance, setTotalCurrentBalance] = useState<number>(0);

  useEffect(() => {
    const mainCurrencyAccounts = allAccounts.filter(
      (account) => account.currency === default_currency
    );
    setAccounts(mainCurrencyAccounts);
    setTotalCurrentBalance(
      mainCurrencyAccounts.reduce(
        (current, account) => current + account.current_balance,
        0
      )
    );
  }, [allAccounts, default_currency]);

  useEffect(() => {
    const channel = supabase
      .channel("insert_account_channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "accounts" },
        (payload) => {
          if (
            payload &&
            payload.new &&
            payload.new.account_type !== "cash_account"
          ) {
            setAccounts((prevAccounts) => [
              ...prevAccounts,
              payload.new as Account,
            ]);
            pushAccount(payload.new as Account);
          }
        }
      )
      .subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, []);

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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Balance overview</CardTitle>
        <CardDescription>
          Total balance across all accounts for your default currency
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center items-center">
          <CustomPieChart
            items={accounts.map((account) => {
              return {
                label: account.institution_name,
                value: account.current_balance,
              };
            })}
          />
        </div>
        <h2 className="text-xs font-semibold">Total:</h2>
        <div className="flex gap-2 items-center">
          <p className="font-medium text-muted-foreground">
            {default_currency}
          </p>
          <div className="text-lg font-bold">
            <AnimatedCounter amount={totalCurrentBalance} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
