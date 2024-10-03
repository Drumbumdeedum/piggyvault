import { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useForm } from "react-hook-form";
import { updateCashBalanceSchema } from "@/validations/cash-balance";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCashTransactionAndUpdateCashBalance } from "@/lib/actions/cash/api.actions";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import FormSubmitButton from "./core/FormSubmitButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

const CreateCashTransactionDialog = ({
  open,
  setOpen,
  setBalance,
  setStartAmount,
  currentBalance,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setBalance: Dispatch<SetStateAction<number>>;
  setStartAmount: Dispatch<SetStateAction<number>>;
  currentBalance: number;
}) => {
  const formSchema = updateCashBalanceSchema();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      currency: "HUF",
      note: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { amount, currency, note } = values;
    const result = await createCashTransactionAndUpdateCashBalance({
      amount: amount,
      currency,
      note,
    });
    if (result && result.current_balance) {
      setStartAmount(currentBalance);
      setBalance(result.current_balance);
      form.reset();
      setOpen(false);
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New cash transaction</DialogTitle>
          <DialogDescription>
            Create a new cash transaction in your selected currency
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
                          {/* <SelectItem value="EUR">EUR</SelectItem> */}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </div>
                  </div>
                )}
              />
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <div>
                    <FormLabel htmlFor="Note">Note</FormLabel>
                    <div className="flex w-full flex-col">
                      <FormControl>
                        <Textarea
                          id="note_text-area"
                          placeholder="Note"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </div>
                )}
              />
              <FormSubmitButton className="mt-4">
                Create cash transaction
              </FormSubmitButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCashTransactionDialog;
