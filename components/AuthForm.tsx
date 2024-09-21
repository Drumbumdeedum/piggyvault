"use client";

import Link from "next/link";
import React from "react";
import FormSubmitButton from "./FormSubmitButton";
import FormInput from "./FormInput";
import { authFormSchema } from "@/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signInAction, signUpAction } from "@/app/actions";
import { useForm } from "react-hook-form";
import { Form } from "./ui/form";

const AuthForm = ({ type }: AuthFormParams) => {
  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === "sign-up") {
        signUpAction(values);
      }
      if (type === "sign-in") {
        signInAction(values);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col min-w-64 max-w-64 mx-auto"
        >
          <h1 className="text-2xl font-medium">
            {type === "sign-in" ? "Sign in" : "Sign up"}
          </h1>
          <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
            <FormInput
              id="form_email_input"
              control={form.control}
              name="email"
              label="Email"
              placeholder="your.name@provider.com"
            />
            <FormInput
              id="form_password_input"
              control={form.control}
              name="password"
              label="Password"
              placeholder="Your password"
            />
            {type === "sign-up" && (
              <>
                <FormInput
                  id="form_first_name_input"
                  control={form.control}
                  name="firstName"
                  label="First name"
                  placeholder="First name"
                />
                <FormInput
                  id="form_last_name_input"
                  control={form.control}
                  name="lastName"
                  label="Last name"
                  placeholder="Last name"
                />
              </>
            )}
            <FormSubmitButton
              pendingText={
                type === "sign-up" ? "Signing up..." : "Signing in..."
              }
            >
              {type === "sign-in" ? "Sign in" : "Sign up"}
            </FormSubmitButton>
          </div>
        </form>
      </Form>
      <footer className="flex justify-center items-baseline gap-1">
        <p>
          {type === "sign-in"
            ? "Don't have an account?"
            : "Already have an account?"}
        </p>
        <Link
          className="form-link"
          href={type === "sign-in" ? "/sign-up" : "/sign-in"}
        >
          {type === "sign-in" ? "Sign up" : "Sign in"}
        </Link>
      </footer>
    </>
  );
};

export default AuthForm;
