"use client";

import { formatAmount, shortenString } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";

const RecentTransactionsBox = ({
  transactions,
}: {
  transactions: Transaction[];
}) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Recent transactions</CardTitle>
        <CardDescription>Your most recent transactions</CardDescription>
        <Separator />
      </CardHeader>
      <CardContent>
        <ScrollArea className="shadow-inner rounded-xl md:max-h-[22rem] xl:max-h-[18rem] flex flex-col overflow-y-auto">
          {transactions.map((transaction, index) => {
            return (
              <HoverCard key={index}>
                <HoverCardTrigger>
                  <div className="p-2 m-1 rounded-lg bg-card text-card-foreground shadow flex gap-1 text-xs cursor-pointer">
                    <div className="flex-1 ">
                      <p className="text-[10px] font-semibold">
                        {transaction.value_date || transaction.booking_date}
                      </p>
                      <p className="text-[8px]">
                        {shortenString(
                          transaction.remittance_information.reduce(
                            (curr, result) => (result = result.concat(curr))
                          ),
                          14
                        )}
                      </p>
                    </div>
                    <div className="flex gap-1 items-center justify-end">
                      <p className="font-bold">
                        {transaction.credit_debit_indicator === "CRDT"
                          ? "+"
                          : "-"}
                        {formatAmount(
                          parseFloat(transaction.transaction_amount.amount)
                        )}{" "}
                      </p>
                      <p className="text-muted-foreground">
                        {transaction.transaction_amount.currency}
                      </p>
                    </div>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent>
                  <div>
                    <div>
                      {transaction.remittance_information.reduce(
                        (curr, result) => (result = result.concat(curr))
                      )}
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            );
          })}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default RecentTransactionsBox;
