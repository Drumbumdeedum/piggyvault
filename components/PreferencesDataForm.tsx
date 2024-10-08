"use client";

import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { preferredCurrencySchema } from "@/validations/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import { useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { enableBankingCurrencies } from "@/constants/enablebankingCountries";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const PreferencesDataForm = ({ user }: { user: User }) => {
  const preferredCurrencyFormSchema = preferredCurrencySchema();
  const preferredCurrencyForm = useForm<
    z.infer<typeof preferredCurrencyFormSchema>
  >({
    resolver: zodResolver(preferredCurrencyFormSchema),
    defaultValues: {
      currency: "",
    },
  });

  /* useEffect(() => {
    const channel = supabase
      .channel("update_user_channel")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "users" },
        (payload) => {
          if (payload && payload.new && payload.new.first_name) {
            firstNameForm.setValue("first_name", payload.new.first_name);
          }
          if (payload && payload.new && payload.new.last_name) {
            lastNameForm.setValue("last_name", payload.new.last_name);
          }
        }
      )
      .subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, [firstNameForm, lastNameForm]); */

  const onCurrencyUpdateSubmit = async (
    values: z.infer<typeof preferredCurrencyFormSchema>
  ) => {
    /* await updateFirstName({
      user_id: user.id,
      first_name: values.first_name,
    }); */
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
