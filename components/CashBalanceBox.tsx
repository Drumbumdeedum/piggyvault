"use client";

import { Card, CardContent } from "./ui/card";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { CirclePlus, CreditCard } from "lucide-react";
import AddCashBalanceDialog from "./AddCashBalanceDialog";
import CreateCashTransactionDialog from "./CreateCashTransactionDialog";
import { readCashAccountsByUserId } from "@/lib/actions/cash/db.actions";
import { ScrollArea } from "./ui/scroll-area";
import CashBalanceItem from "./CashBalanceItem";

const CashBalanceBox = ({ user }: { user: User }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [showAddCashBalanceDialog, setShowAddCashBalanceDialog] =
    useState<boolean>(false);
  const [showCreateCashTransactionDialog, setShowCreateCashTransactionDialog] =
    useState<boolean>(false);

  useEffect(() => {
    const getCashBalances = async () => {
      const accounts = await readCashAccountsByUserId(user.id);
      if (accounts) {
        setAccounts(accounts);
      }
    };
    getCashBalances();
  }, []);

  const updateAccountBalance = ({
    amount,
    currency,
  }: {
    amount: number;
    currency: string;
  }) => {
    setAccounts((prevAccounts) =>
      prevAccounts.map((account) => {
        let resultAccount = account;
        if (account.currency === currency) {
          resultAccount = { ...account, current_balance: amount };
        }
        return resultAccount;
      })
    );
  };

  return (
    <>
      <AddCashBalanceDialog
        open={showAddCashBalanceDialog}
        setOpen={setShowAddCashBalanceDialog}
        updateBalance={updateAccountBalance}
      />
      <CreateCashTransactionDialog
        open={showCreateCashTransactionDialog}
        setOpen={setShowCreateCashTransactionDialog}
        updateBalance={updateAccountBalance}
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
