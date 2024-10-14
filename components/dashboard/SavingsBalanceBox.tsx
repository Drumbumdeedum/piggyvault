"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { CircleMinus, CirclePlus, PiggyBank } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { createBrowserClient } from "@supabase/ssr";
import { useAccounts } from "@/lib/stores/accounts";
import BalanceItem from "./BalanceItem";
import AddSavingsBalanceDialog from "./AddSavingsBalanceDialog";
import SavingsWithdrawalDialog from "./SavingsWithdrawalDialog";
import { Separator } from "../ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const SavingsBalanceBox = () => {
  const accounts = useAccounts((s) => s.accounts);
  const updateAccountBalance = useAccounts((s) => s.updateAccountBalance);
  const [savingsAccounts, setSavingsAccounts] = useState<Account[]>([]);
  const [showAddSavingsBalanceDialog, setShowAddSavingsBalanceDialog] =
    useState<boolean>(false);
  const [showSavingsWithdrawalDialog, setShowSavingsWithdrawalDialog] =
    useState<boolean>(false);

  useEffect(() => {
    if (accounts) {
      setSavingsAccounts(
        accounts.filter((account) => account.account_type === "savings_account")
      );
    }
  }, [accounts]);

  useEffect(() => {
    const channel = supabase
      .channel("update_savings_balance_channel")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "accounts" },
        (payload) => {
          if (
            payload &&
            payload.new &&
            payload.new.current_balance &&
            payload.new.currency
          ) {
            updateAccountBalance(payload.new.id, payload.new.current_balance);
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
      .channel("insert_savings_account_channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "accounts" },
        (payload) => {
          if (
            payload &&
            payload.new &&
            payload.new.account_type === "savings_account"
          ) {
            setSavingsAccounts((prevAccounts) => [
              ...prevAccounts,
              payload.new as Account,
            ]);
          }
        }
      )
      .subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, []);

  return (
    <>
      <AddSavingsBalanceDialog
        open={showAddSavingsBalanceDialog}
        setOpen={setShowAddSavingsBalanceDialog}
        savingsAccounts={savingsAccounts}
      />
      <SavingsWithdrawalDialog
        open={showSavingsWithdrawalDialog}
        setOpen={setShowSavingsWithdrawalDialog}
        savingsAccounts={savingsAccounts}
      />
      <Card className="w-full md:max-h-[30rem]">
        <CardHeader className="pb-3">
          <CardTitle>
            <div className="font-semibold flex items-center gap-2">
              <PiggyBank size="22" />
              <p className="flex-1">Savings</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="justify-start p-1 h-auto w-auto"
                      onClick={() => setShowAddSavingsBalanceDialog(true)}
                    >
                      <CirclePlus size="18" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add savings balance</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      className="justify-start p-1 h-auto w-auto"
                      onClick={() => setShowSavingsWithdrawalDialog(true)}
                    >
                      <CircleMinus size="18" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Withdraw money</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardTitle>
          <CardDescription>Total savings balance</CardDescription>
          <Separator />
        </CardHeader>
        <CardContent>
          <ScrollArea className="shadow-inner rounded-xl md:max-h-[22rem] xl:max-h-[18rem] flex flex-col overflow-y-auto">
            {savingsAccounts.map((account, index) => {
              return (
                <BalanceItem
                  key={index}
                  current_balance={account.current_balance}
                  currency={account.currency}
                  balance_name={account.institution_name}
                />
              );
            })}
          </ScrollArea>
        </CardContent>
      </Card>
    </>
  );
};

export default SavingsBalanceBox;
