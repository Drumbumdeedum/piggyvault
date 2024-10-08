"use client";

import { formatAmount, formatDate } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Transaction>[] = [
  {
    id: "date",
    header: "Date",
    accessorFn: (transaction) =>
      transaction.value_date
        ? transaction.value_date
        : transaction.booking_date,
  },
  {
    id: "creditor",
    header: "Creditor",
    accessorFn: (transaction) =>
      transaction.creditor ? transaction.creditor.name : "",
  },
  {
    id: "details",
    header: "Details",
    accessorFn: (transaction) =>
      transaction.remittance_information.reduce(
        (curr, result) => (result = result.concat(curr))
      ),
  },
  {
    id: "amount",
    header: "Amount",
    accessorFn: (transaction) =>
      `${transaction.credit_debit_indicator === "CRDT" ? "+" : "-"}${formatAmount(parseFloat(transaction.transaction_amount.amount))} ${transaction.transaction_amount.currency}`,
  },
];
