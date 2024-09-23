import FormError from "@/components/FormError";
import FormSubmitButton from "@/components/FormSubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPasswordAction } from "@/lib/actions/auth.actions";

export default async function ResetPassword({
  searchParams,
}: {
  searchParams: FormResponse;
}) {
  return (
    <form className="flex flex-col w-full max-w-md p-4 gap-2 [&>input]:mb-4">
      <h1 className="text-2xl font-medium">Reset password</h1>
      <p className="text-sm text-foreground/60">
        Please enter your new password below.
      </p>
      <Label htmlFor="password">New password</Label>
      <Input
        type="password"
        name="password"
        placeholder="New password"
        required
      />
      <Label htmlFor="confirmPassword">Confirm password</Label>
      <Input
        type="password"
        name="confirmPassword"
        placeholder="Confirm password"
        required
      />
      <FormSubmitButton formAction={resetPasswordAction}>
        Reset password
      </FormSubmitButton>
      <FormError response={searchParams} />
    </form>
  );
}
