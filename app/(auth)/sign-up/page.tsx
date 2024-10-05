"use client";

import AuthForm from "@/components/auth/AuthForm";

export default function Signup({
  searchParams,
}: {
  searchParams: FormResponse;
}) {
  return (
    <section className="flex items-center justify-center size-full max-sm:px-6">
      <AuthForm type="sign-up" searchParams={searchParams} />
    </section>
  );
}
