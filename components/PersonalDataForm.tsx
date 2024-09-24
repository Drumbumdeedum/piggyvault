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
import { updateFirstName, updateLastName } from "@/lib/actions/account.actions";
import { revalidatePath } from "next/cache";

const PersonalDataForm = ({ user }: { user: User }) => {
  const firstNameFormSchema = firstNameSchema();
  const firstNameForm = useForm<z.infer<typeof firstNameFormSchema>>({
    resolver: zodResolver(firstNameFormSchema),
    defaultValues: {
      firstName: user.firstName,
    },
  });
  const lastNameFormSchema = lastNameSchema();
  const lastNameForm = useForm<z.infer<typeof lastNameFormSchema>>({
    resolver: zodResolver(lastNameFormSchema),
    defaultValues: {
      lastName: user.lastName,
    },
  });

  const onFirstNameSubmit = async (
    values: z.infer<typeof firstNameFormSchema>
  ) => {
    await updateFirstName({
      userId: user.id,
      firstName: values.firstName,
    });
  };
  const onLastNameSubmit = async (
    values: z.infer<typeof lastNameFormSchema>
  ) => {
    await updateLastName({
      userId: user.id,
      lastName: values.lastName,
    });
  };
  return (
    <div className="flex flex-col gap-6">
      <Form {...firstNameForm}>
        <form
          onSubmit={firstNameForm.handleSubmit(onFirstNameSubmit)}
          className="flex flex-row gap-2"
        >
          <FormField
            control={firstNameForm.control}
            name="firstName"
            render={({ field }) => (
              <div>
                <FormLabel htmlFor="First name">First name</FormLabel>
                <div className="flex gap-2 w-full">
                  <div className="flex flex-1 flex-col gap-1">
                    <FormControl>
                      <Input
                        className="w-96"
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
            name="lastName"
            render={({ field }) => (
              <div>
                <FormLabel htmlFor="First name">Last name</FormLabel>
                <div className="flex gap-2 w-full">
                  <div className="flex flex-1 flex-col gap-1">
                    <FormControl>
                      <Input
                        className="w-96"
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
