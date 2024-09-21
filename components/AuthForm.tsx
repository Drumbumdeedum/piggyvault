"use client";

import Link from "next/link";
import React from "react";
import FormSubmitButton from "./FormSubmitButton";
import { authFormSchema } from "@/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signInAction, signUpAction } from "@/app/actions";
import { useForm } from "react-hook-form";
import { Form } from "./ui/form";
import FormError from "./FormError";
import AuthFormInput from "./AuthFormInput";
import { motion } from "framer-motion";

const AuthForm = ({ type, searchParams }: AuthFormParams) => {
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
    <motion.section
      className="flex min-h-screen w-full max-w-[420px] flex-col justify-center gap-5 py-10 md:gap-8 transition-transform will-change-transform"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ style: "tween", duration: 0.3 }}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <h1 className="text-2xl font-medium">
            {type === "sign-in" ? "Sign in" : "Sign up"}
          </h1>
          <FormError response={searchParams} />
          <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
            <AuthFormInput
              id="form_email_input"
              control={form.control}
              name="email"
              label="Email"
              placeholder="your.name@provider.com"
            />
            <AuthFormInput
              id="form_password_input"
              control={form.control}
              name="password"
              label="Password"
              placeholder="Your password"
            />
            {type === "sign-up" && (
              <>
                <AuthFormInput
                  id="form_first_name_input"
                  control={form.control}
                  name="firstName"
                  label="First name"
                  placeholder="First name"
                />
                <AuthFormInput
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
    </motion.section>
  );
};

export default AuthForm;
