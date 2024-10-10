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
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "created_at",
    header: "Date",
  },
  {
    accessorKey: "creditor.name",
    header: "Creditor",
  },
  {
    accessorKey: "debtor.name",
    header: "Debtor",
  },
  {
    accessorKey: "transaction.remittance_information",
    header: "Details",
  },
  {
    accessorKey: "transaction_amount.amount",
    header: "Amount",
  },
  {
    accessorKey: "transaction_amount.currency",
    header: "Currency",
  },
];

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

function TransactionsTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const user_id = useUser((state: any) => state.id);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

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
              payload.new as Transaction,
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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
  /* <Table>
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
    </Table> */
}

export default TransactionsTable;
