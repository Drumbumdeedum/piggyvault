declare type AuthFormParams = {
  type: "sign-up" | "sign-in";
  searchParams: FormResponse;
};

declare type FormResponse =
  | { success: string }
  | { error: string }
  | { message: string };

declare interface PlaidLinkProps {
  user: User;
  variant?: "primary" | "ghost";
  dwollaCustomerId?: string;
}

declare type User = {
  id: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
};

declare interface ExchangePublicTokenProps {
  publicToken: string;
  user: User;
}
