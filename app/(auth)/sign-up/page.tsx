import AuthForm from "@/components/AuthForm";

export default function Signup() {
  return (
    <section className="flex items-center justify-center size-full max-sm:px-6">
      <AuthForm type="sign-up" />
    </section>
  );
}
