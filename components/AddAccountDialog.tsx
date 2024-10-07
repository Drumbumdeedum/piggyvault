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
import { enableBankingCurrencies } from "@/constants/enablebankingCountries";
import { addAccountSchema } from "@/validations/accounts";
import { Coins, PiggyBank } from "lucide-react";
import { addNewAccount } from "@/lib/actions/accounts/api.actions";

const AddAccountDialog = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const formSchema = addAccountSchema();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "",
      current_balance: 0,
      currency: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { name, type, current_balance, currency } = values;
    await addNewAccount({ name, type, current_balance, currency });
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
          <DialogTitle>Create account</DialogTitle>
          <DialogDescription>
            Create a new cash or savings account
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <div>
                    <FormLabel htmlFor="Name">Name</FormLabel>
                    <div className="flex w-full flex-col">
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Account name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </div>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <div>
                    <FormLabel htmlFor="Type">Type</FormLabel>
                    <div className="flex w-full flex-col">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder="Select a type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="cash_account">
                            <div className="flex">
                              <Coins size="18" className="mr-2" />
                              Cash account
                            </div>
                          </SelectItem>
                          <SelectItem value="savings_account">
                            <div className="flex">
                              <PiggyBank size="18" className="mr-2" />
                              Savings account
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </div>
                  </div>
                )}
              />
              <FormField
                control={form.control}
                name="current_balance"
                render={({ field }) => (
                  <div>
                    <FormLabel htmlFor="Balance">Balance</FormLabel>
                    <div className="flex w-full flex-col">
                      <FormControl>
                        <Input
                          id="amount_input"
                          placeholder="0"
                          type="number"
                          {...field}
                        />
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
                    <FormLabel htmlFor="Currency">Currency</FormLabel>
                    <div className="flex w-full flex-col">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {enableBankingCurrencies.map((currency, index) => {
                            return (
                              <SelectItem key={index} value={currency}>
                                {currency}
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

export default AddAccountDialog;
