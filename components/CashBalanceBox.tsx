"use client";

import { Card, CardContent } from "./ui/card";
import AnimatedCounter from "./util/AnimatedCounter";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { CirclePlus, CreditCard } from "lucide-react";
import AddCashBalanceDialog from "./AddCashBalanceDialog";
import CreateCashTransactionDialog from "./CreateCashTransactionDialog";
import { readCashAccountsByUserId } from "@/lib/actions/cash/db.actions";
import { ScrollArea } from "./ui/scroll-area";

const CashBalanceBox = ({ user }: { user: User }) => {
  const [startAmount, setStartAmount] = useState<number>(0);
  const [totalCurrentBalance, setTotalCurrentBalance] = useState<number>(0);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [showAddCashBalanceDialog, setShowAddCashBalanceDialog] =
    useState<boolean>(false);
  const [showCreateCashTransactionDialog, setShowCreateCashTransactionDialog] =
    useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      setStartAmount(totalCurrentBalance);
    }, 1000);
  }, [totalCurrentBalance]);

  useEffect(() => {
    const getCashBalances = async () => {
      const accounts = await readCashAccountsByUserId(user.id);
      if (accounts) {
        setTotalCurrentBalance(accounts[0].current_balance);
        setAccounts(accounts);
      }
    };
    getCashBalances();
  }, []);

  return (
    <>
      <AddCashBalanceDialog
        open={showAddCashBalanceDialog}
        setOpen={setShowAddCashBalanceDialog}
        setBalance={setTotalCurrentBalance}
      />
      <CreateCashTransactionDialog
        open={showCreateCashTransactionDialog}
        setOpen={setShowCreateCashTransactionDialog}
        setBalance={setTotalCurrentBalance}
      />
      <Card className="w-72">
        <CardContent className="p-0 w-full h-full">
          <div className="relative flex flex-col h-full gap-6 p-5">
            <div className="flex-1">
              <p className="font-bold">Total cash balance:</p>
              <ScrollArea className="h-[180px]">
                <div className="flex flex-col gap-2">
                  {accounts.map((account, index) => {
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg bg-card text-card-foreground shadow"
                      >
                        <p className="font-medium text-muted-foreground">
                          {account.currency}
                        </p>
                        <div className="text-lg font-bold">
                          <AnimatedCounter
                            amount={account.current_balance}
                            startAmount={0}
                          />
                        </div>
                      </div>
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
