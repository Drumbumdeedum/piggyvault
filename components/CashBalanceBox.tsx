"use client";

import { Card, CardContent } from "./ui/card";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { CirclePlus, CreditCard } from "lucide-react";
import AddCashBalanceDialog from "./AddCashBalanceDialog";
import CreateCashTransactionDialog from "./CreateCashTransactionDialog";
import { ScrollArea } from "./ui/scroll-area";
import CashBalanceItem from "./CashBalanceItem";
import { createBrowserClient } from "@supabase/ssr";
import { useAccounts } from "@/lib/stores/accounts";

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
      .channel("update_balance_channel")
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

  return (
    <>
      <AddCashBalanceDialog
        open={showAddCashBalanceDialog}
        setOpen={setShowAddCashBalanceDialog}
      />
      <CreateCashTransactionDialog
        open={showCreateCashTransactionDialog}
        setOpen={setShowCreateCashTransactionDialog}
      />
      <Card className="w-72">
        <CardContent className="p-0 w-full h-full">
          <div className="relative flex flex-col h-full gap-6 p-5">
            <div className="flex-1">
              <p className="font-semibold">Total cash balance:</p>
              <ScrollArea className="h-[180px]">
                <div className="flex flex-col gap-2">
                  {accounts.map((account, index) => {
                    return (
                      <CashBalanceItem
                        key={index}
                        current_balance={account.current_balance}
                        currency={account.currency}
                      />
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
            <div className="flex flex-col justify-center gap-2">
              <Button
                className="justify-start"
                onClick={() => setShowAddCashBalanceDialog(true)}
              >
                <CirclePlus className="mr-1" />
                Add funds
              </Button>
              <Button
                variant="secondary"
                className="justify-start"
                onClick={() => setShowCreateCashTransactionDialog(true)}
              >
                <CreditCard className="mr-1" />
                Cash transaction
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default CashBalanceBox;
