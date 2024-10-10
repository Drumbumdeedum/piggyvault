"use client";

import { Card, CardContent } from "./ui/card";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { CircleMinus, CirclePlus, Coins } from "lucide-react";
import AddCashBalanceDialog from "./AddCashBalanceDialog";
import CreateCashTransactionDialog from "./CreateCashTransactionDialog";
import { ScrollArea } from "./ui/scroll-area";
import { createBrowserClient } from "@supabase/ssr";
import { useAccounts } from "@/lib/stores/accounts";
import BalanceItem from "./BalanceItem";
import { Separator } from "./ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const CashBalanceBox = () => {
  const cashAccounts = useAccounts((s) => s.accounts);
  const updateAccountBalance = useAccounts((s) => s.updateAccountBalance);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [showAddCashBalanceDialog, setShowAddCashBalanceDialog] =
    useState<boolean>(false);
  const [showCreateCashTransactionDialog, setShowCreateCashTransactionDialog] =
    useState<boolean>(false);

  useEffect(() => {
    if (cashAccounts) {
      setAccounts(
        cashAccounts.filter(
          (account) => account.account_type === "cash_account"
        )
      );
    }
  }, [cashAccounts]);

  useEffect(() => {
    const channel = supabase
      .channel("update_cash_balance_channel")
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
      .channel("insert_cash_account_channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "accounts" },
        (payload) => {
          if (
            payload &&
            payload.new &&
            payload.new.account_type === "cash_account"
          ) {
            setAccounts((prevAccounts) => [
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
      <AddCashBalanceDialog
        open={showAddCashBalanceDialog}
        setOpen={setShowAddCashBalanceDialog}
        cashAccounts={cashAccounts}
      />
      <CreateCashTransactionDialog
        open={showCreateCashTransactionDialog}
        setOpen={setShowCreateCashTransactionDialog}
        cashAccounts={cashAccounts}
      />
      <Card className="w-[16rem] h-[20rem]">
        <CardContent className="p-0 w-full h-full">
          <div className="relative flex flex-col h-full gap-6 p-5">
            <div className="flex-1 flex flex-col gap-2">
              <div className="font-semibold flex items-center gap-2">
                <Coins size="22" />
                <p className="flex-1">Cash</p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="justify-start p-1 h-auto w-auto"
                        onClick={() => setShowAddCashBalanceDialog(true)}
                      >
                        <CirclePlus size="18" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add cash balance</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="secondary"
                        className="justify-start p-1 h-auto w-auto"
                        onClick={() => setShowCreateCashTransactionDialog(true)}
                      >
                        <CircleMinus size="18" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Create cash transaction</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Separator />
              <ScrollArea className="h-[14rem] shadow-inner rounded-xl">
                <div className="flex flex-col">
                  {accounts.map((account, index) => {
                    return (
                      <BalanceItem
                        key={index}
                        current_balance={account.current_balance}
                        currency={account.currency}
                      />
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default CashBalanceBox;
