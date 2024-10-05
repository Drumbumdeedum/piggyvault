"use client";

import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { firstNameSchema, lastNameSchema } from "@/validations/account";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import { updateFirstName, updateLastName } from "@/lib/actions/user.actions";
import { useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useUser } from "@/lib/stores/user";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const PersonalDataForm = () => {
  const user = useUser((state: any) => state.user);
  const firstNameFormSchema = firstNameSchema();
  const firstNameForm = useForm<z.infer<typeof firstNameFormSchema>>({
    resolver: zodResolver(firstNameFormSchema),
    defaultValues: {
      first_name: user.first_name,
    },
  });
  const lastNameFormSchema = lastNameSchema();
  const lastNameForm = useForm<z.infer<typeof lastNameFormSchema>>({
    resolver: zodResolver(lastNameFormSchema),
    defaultValues: {
      last_name: user.last_name,
    },
  });

  useEffect(() => {
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
  }, [firstNameForm, lastNameForm]);

  const onFirstNameSubmit = async (
    values: z.infer<typeof firstNameFormSchema>
  ) => {
    await updateFirstName({
      user_id: user.id,
      first_name: values.first_name,
    });
  };
  const onLastNameSubmit = async (
    values: z.infer<typeof lastNameFormSchema>
  ) => {
    await updateLastName({
      user_id: user.id,
      last_name: values.last_name,
    });
  };
  return (
    <div className="flex flex-col gap-6 lg:min-w-[50rem]">
      <Form {...firstNameForm}>
        <form
          onSubmit={firstNameForm.handleSubmit(onFirstNameSubmit)}
          className="flex flex-row gap-2"
        >
          <FormField
            control={firstNameForm.control}
            name="first_name"
            render={({ field }) => (
              <div>
                <FormLabel htmlFor="First name">First name</FormLabel>
                <div className="flex gap-2 w-full">
                  <div className="flex flex-1 flex-col gap-1">
                    <FormControl>
                      <Input
                        className="min-w-96"
                        id="first_name_form_input"
                        type="text"
                        placeholder="First name"
                        autoComplete="on"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                  <Button className="h-[40px] w-[164px]" type="submit">
                    Update first name
                  </Button>
                </div>
              </div>
            )}
          />
        </form>
      </Form>
      <Form {...lastNameForm}>
        <form
          onSubmit={lastNameForm.handleSubmit(onLastNameSubmit)}
          className="flex flex-row gap-2"
        >
          <FormField
            control={lastNameForm.control}
            name="last_name"
            render={({ field }) => (
              <div>
                <FormLabel htmlFor="First name">Last name</FormLabel>
                <div className="flex gap-2 w-full">
                  <div className="flex flex-1 flex-col gap-1">
                    <FormControl>
                      <Input
                        className="min-w-96"
                        id="last_name_form_input"
                        type="text"
                        placeholder="Last name"
                        autoComplete="on"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                  <Button className="h-[40px] w-[164px]" type="submit">
                    Update last name
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

export default PersonalDataForm;
