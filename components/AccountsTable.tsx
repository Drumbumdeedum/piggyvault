"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { useAccounts } from "@/lib/stores/accounts";
import { Coins, DollarSign, PiggyBank } from "lucide-react";
import { formatAmount } from "@/lib/utils";

const accountTypes = {
  bank_account: {
    label: "Bank",
    icon: <DollarSign size="18" />,
  },
  savings_account: {
    label: "Savings",
    icon: <PiggyBank size="18" />,
  },
  cash_account: {
    label: "Cash",
    icon: <Coins size="18" />,
  },
};

const AccountsTable = () => {
  const storedAccounts = useAccounts((s) => s.accounts);
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    if (storedAccounts) {
      setAccounts(storedAccounts);
    }
  }, [storedAccounts]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Account</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="flex justify-end items-center">
            Balance
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {accounts.map((account, index) => {
          return (
            <TableRow key={index}>
              <TableCell>{account.institution_name}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {accountTypes[account.account_type].icon}
                  <p>{accountTypes[account.account_type].label}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-2 justify-end">
                  <p className="font-semibold">
                    {formatAmount(account.current_balance)}
                  </p>
                  <p className="font-medium text-muted-foreground">
                    {account.currency}
                  </p>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default AccountsTable;
