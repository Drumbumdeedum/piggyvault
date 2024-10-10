"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { fetchTransactionsSinceLastTransaction } from "@/lib/actions/enablebanking/api.actions";
import { formatAmount, shortenString } from "@/lib/utils";
import { cn } from "@/utils/cn";
import { useEffect, useState } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { skeletonItems } from "@/constants/placeholders";
import { Skeleton } from "./ui/skeleton";
import { useUser } from "@/lib/stores/user";
import { createBrowserClient } from "@supabase/ssr";
import { readTransactionsByUserId } from "@/lib/actions/enablebanking/db.actions";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const TransactionsTable = () => {
  const user_id = useUser((state: any) => state.id);
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const fetchedTransactions = await readTransactionsByUserId(user_id);
      if (fetchedTransactions) {
        setTransactions(fetchedTransactions);
      }
    };
    if (user_id) {
      fetchTransactions();
      fetchTransactionsSinceLastTransaction();
    }
  }, [user_id]);

  useEffect(() => {
    const channel = supabase
      .channel("insert_new_transaction_channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "transactions" },
        (payload) => {
          if (payload && payload.new) {
            setTransactions((current) => [
              payload.new as TransactionResponse,
              ...current,
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Date</TableHead>
          <TableHead>Creditor</TableHead>
          <TableHead>Debtor</TableHead>
          <TableHead>Details</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead>Currency</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.length
          ? transactions.map((transaction, index) => {
              return (
                <TableRow key={index}>
                  <TableCell className="font-medium cursor-pointer">
                    {transaction.value_date
                      ? transaction.value_date
                      : transaction.booking_date}
                  </TableCell>
                  <TableCell className="cursor-pointer">
                    <HoverCard>
                      <HoverCardTrigger>
                        {transaction.creditor?.name
                          ? shortenString(transaction.creditor.name)
                          : ""}
                      </HoverCardTrigger>
                      <HoverCardContent>
                        {transaction.creditor?.name
                          ? transaction.creditor.name
                          : ""}
                      </HoverCardContent>
                    </HoverCard>
                  </TableCell>
                  <TableCell className="cursor-pointer">
                    {transaction.debtor?.name
                      ? shortenString(transaction.debtor.name)
                      : ""}
                  </TableCell>
                  <TableCell className="cursor-pointer">
                    <HoverCard>
                      <HoverCardTrigger>
                        {shortenString(
                          transaction.remittance_information.reduce(
                            (curr, result) => (result = result.concat(curr))
                          )
                        )}
                      </HoverCardTrigger>
                      <HoverCardContent>
                        {transaction.remittance_information}
                      </HoverCardContent>
                    </HoverCard>
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-right font-mono cursor-pointer",
                      transaction.credit_debit_indicator === "CRDT"
                        ? "text-green-400"
                        : "text-red-500"
                    )}
                  >
                    {transaction.credit_debit_indicator === "CRDT" ? "+" : "-"}
                    {formatAmount(
                      parseFloat(transaction.transaction_amount.amount)
                    )}
                  </TableCell>
                  <TableCell className="cursor-pointer">
                    {transaction.transaction_amount.currency}
                  </TableCell>
                </TableRow>
              );
            })
          : skeletonItems(30).map((_item, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-[21px] w-[84px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-[21px] w-[189px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-[21px] w-[174px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-[21px] w-[163px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-[21px] w-[109px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-[21px] w-[61px]" />
                  </TableCell>
                </TableRow>
              );
            })}
      </TableBody>
    </Table>
  );
};

export default TransactionsTable;
