declare type AuthFormParams = {
  type: "sign-up" | "sign-in";
  searchParams: FormResponse;
};

declare type FormResponse =
  | { success: string }
  | { error: string }
  | { message: string };
