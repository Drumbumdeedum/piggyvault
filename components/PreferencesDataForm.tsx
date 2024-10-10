"use client";

import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { preferredCurrencySchema } from "@/validations/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { enableBankingCurrencies } from "@/constants/enablebankingCountries";
import { updateDefaultCurrencyByUserId } from "@/lib/actions/user.actions";
import { useUser } from "@/lib/stores/user";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const PreferencesDataForm = ({
  default_currency,
}: {
  default_currency: string;
}) => {
  const user_id = useUser((state) => state.id);
  const updateDefaultCurrency = useUser((state) => state.updateDefaultCurrency);
  const preferredCurrencyFormSchema = preferredCurrencySchema();
  const preferredCurrencyForm = useForm<
    z.infer<typeof preferredCurrencyFormSchema>
  >({
    resolver: zodResolver(preferredCurrencyFormSchema),
    defaultValues: {
      currency: default_currency,
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel("update_default_currency_channel")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "users" },
        (payload) => {
          if (payload && payload.new && payload.new.default_currency) {
            updateDefaultCurrency(payload.new.default_currency);
          }
        }
      )
      .subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, [preferredCurrencyForm]);

  const onCurrencyUpdateSubmit = async (
    values: z.infer<typeof preferredCurrencyFormSchema>
  ) => {
    await updateDefaultCurrencyByUserId({
      user_id: user_id!,
      default_currency: values.currency,
    });
  };
  return (
    <div className="flex flex-col gap-6 lg:min-w-[50rem]">
      <Form {...preferredCurrencyForm}>
        <form
          onSubmit={preferredCurrencyForm.handleSubmit(onCurrencyUpdateSubmit)}
          className="flex flex-row gap-2"
        >
          <FormField
            control={preferredCurrencyForm.control}
            name="currency"
            render={({ field }) => (
              <div>
                <FormLabel htmlFor="Default currency">
                  Default currency
                </FormLabel>
                <div className="flex flex-row gap-2 w-full">
                  <div className="flex flex-1 flex-col gap-1 min-w-96">
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10">
                          <SelectValue></SelectValue>
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
                  <Button className="h-[40px] w-[164px]" type="submit">
                    Update currency
                  </Button>
                </div>
              </div>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default PreferencesDataForm;
