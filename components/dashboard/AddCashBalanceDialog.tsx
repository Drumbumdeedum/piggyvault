"use client";

import { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "../ui/form";
import FormSubmitButton from "../core/FormSubmitButton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { updateCashBalance } from "@/lib/actions/cash/api.actions";
import { updateCashBalanceSchema } from "@/validations/balance";

const AddCashBalanceDialog = ({
  open,
  setOpen,
  cashAccounts,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  cashAccounts: Account[];
}) => {
  const formSchema = updateCashBalanceSchema();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: undefined,
      account_id: undefined,
    },
  });

  //console.log(cashAccounts);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { account_id, amount } = values;
    await updateCashBalance({ account_id, amount });
    form.reset();
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        form.reset();
        setOpen(!open);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add cash balance</DialogTitle>
          <DialogDescription>
            Add a cash balance amount to your selected currency
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <div>
                    <FormLabel htmlFor="Amount">Amount</FormLabel>
                    <div className="flex w-full flex-col">
                      <FormControl>
                        <Input id="amount_input" type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </div>
                )}
              />
              <FormField
                control={form.control}
                name="account_id"
                render={({ field }) => (
                  <div>
                    <FormLabel htmlFor="Account">Account</FormLabel>
                    <div className="flex w-full flex-col">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder="Select an account" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cashAccounts.map((account, index) => {
                            return (
                              <SelectItem key={index} value={account.id}>
                                {account.balance_name}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </div>
                  </div>
                )}
              />
              <FormSubmitButton className="mt-4">Add funds</FormSubmitButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCashBalanceDialog;
