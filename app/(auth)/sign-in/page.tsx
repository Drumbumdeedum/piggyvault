import AuthForm from "@/components/AuthForm";

export default function Signin() {
  return (
    <section className="flex items-center justify-center size-full max-sm:px-6">
      <AuthForm type="sign-in" />
    </section>
  );
}
