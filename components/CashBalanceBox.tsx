"use client";

import { Card, CardContent } from "./ui/card";
import AnimatedCounter from "./util/AnimatedCounter";
import { useState } from "react";
import { Button } from "./ui/button";
import { CirclePlus, CreditCard } from "lucide-react";
import AddCashBalanceDialog from "./AddCashBalanceDialog";
import CreateCashTransactionDialog from "./CreateCashTransactionDialog";

const CashBalanceBox = () => {
  const [totalCurrentBalance, setTotalCurrentBalance] = useState<number>(43500);
  const [showAddCashBalanceDialog, setShowAddCashBalanceDialog] =
    useState<boolean>(false);
  const [showCreateCashTransactionDialog, setShowCreateCashTransactionDialog] =
    useState<boolean>(false);

  const open = async () => {};

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
              <p className="font-bold">Total cash balance:</p>
              <div className="text-xl text-green-600 font-mono font-bold">
                <AnimatedCounter amount={totalCurrentBalance} />
              </div>
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
