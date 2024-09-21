import {
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Control, FieldPath } from "react-hook-form";
import { Input } from "./ui/input";
import { z } from "zod";
import { authFormSchema, forgotPasswordFormSchema } from "@/validations/auth";

const authFormSchemaType = authFormSchema("sign-up");
const forgotPasswordFormSchemaType = forgotPasswordFormSchema();
type FormInputProps = {
  id: string;
  control: Control<
    z.infer<typeof authFormSchemaType | typeof forgotPasswordFormSchemaType>
  >;
  name: FieldPath<
    z.infer<typeof authFormSchemaType | typeof forgotPasswordFormSchemaType>
  >;
  label: string;
  placeholder: string;
};

const FormInput = ({
  id,
  control,
  name,
  label,
  placeholder,
}: FormInputProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div>
          <FormLabel htmlFor={name}>{label}</FormLabel>
          <div className="flex w-full flex-col">
            <FormControl>
              <Input
                id={id}
                type={name === "password" ? "password" : "text"}
                placeholder={placeholder}
                autoComplete="on"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </div>
        </div>
      )}
    />
  );
};

export default FormInput;
