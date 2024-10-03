"use client";

import { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "./ui/form";
import FormSubmitButton from "./core/FormSubmitButton";
import { addCashBalanceSchema } from "@/validations/cash-balance";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { addCashBalance } from "@/lib/actions/cash/api.actions";

const AddCashBalanceDialog = ({
  open,
  setOpen,
  setBalance,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setBalance: Dispatch<SetStateAction<number>>;
}) => {
  const formSchema = addCashBalanceSchema();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      currency: "HUF",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { amount, currency } = values;
    const result = await addCashBalance({ amount, currency });
    if (result && result.current_balance) {
      setBalance(result.current_balance);
      form.reset();
      setOpen(false);
    }
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
                    <FormLabel htmlFor="Balance">Balance</FormLabel>
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
                name="currency"
                render={({ field }) => (
                  <div>
                    <FormLabel htmlFor="Balance">Currency</FormLabel>
                    <div className="flex w-full flex-col">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder="HUF" defaultValue="HUF" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="HUF">HUF</SelectItem>
                          {/*                           <SelectItem value="EUR">EUR</SelectItem>
                           */}
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
