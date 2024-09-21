"use client";

import FormSubmitButton from "@/components/FormSubmitButton";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { forgotPasswordFormSchema } from "@/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function ForgotPassword() {
  const formSchema = forgotPasswordFormSchema();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  return (
    <section className="flex items-center justify-center size-full max-sm:px-6">
      <section className="flex min-h-screen w-full max-w-[420px] flex-col justify-center gap-5 py-10 md:gap-8">
        <Form {...form}>
          <form className="space-y-8">
            <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <div>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <div className="flex w-full flex-col">
                      <FormControl>
                        <Input
                          id="reset_passwort_email_input"
                          type="text"
                          placeholder="your.name@provider.com"
                          autoComplete="on"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </div>
                )}
              />
              <FormSubmitButton>Reset Password</FormSubmitButton>
              <FormMessage />
            </div>
          </form>
        </Form>
        <footer className="flex justify-center items-baseline gap-1">
          <div>
            <h1 className="text-2xl font-medium">Reset Password</h1>
            <p className="text-sm text-secondary-foreground">
              Already have an account?{" "}
              <Link className="text-primary underline" href="/sign-in">
                Sign in
              </Link>
            </p>
          </div>
        </footer>
      </section>
    </section>
  );
}
