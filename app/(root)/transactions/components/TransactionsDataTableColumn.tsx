"use client";

import { formatAmount } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Transaction>[] = [
  {
    id: "booking_date",
    header: "Transaction date",
    accessorFn: (transaction) =>
      transaction.booking_date ? transaction.booking_date : "",
  },
  {
    id: "value_date",
    header: "Processed date",
    accessorFn: (transaction) =>
      transaction.value_date ? transaction.value_date : "",
  },
  {
    id: "status",
    header: "Status",
    accessorFn: (transaction) =>
      transaction.status === "BOOK"
        ? "Processed"
        : transaction.status === "PDNG"
          ? "Pending"
          : "Unknown",
  },
  {
    id: "category",
    header: "Category",
    accessorFn: (transaction) =>
      transaction.category ? transaction.category : "",
  },
  {
    id: "creditor",
    header: "Vendor / Recipient",
    accessorFn: (transaction) =>
      transaction.creditor && transaction.creditor.name
        ? transaction.creditor.name
        : "",
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
