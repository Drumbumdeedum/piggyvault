import { create } from "zustand";

type UserState = {
  id: string | undefined;
  email: string | undefined;
  first_name: string | undefined;
  last_name: string | undefined;
  default_currency?: string | undefined;
};

type UserAction = {
  updateFirstName: (first_name: string) => void;
  updateLastName: (last_name: string) => void;
  updateDefaultCurrency: (currency: string) => void;
};

export const useUser = create<UserState & UserAction>()((set) => ({
  id: undefined,
  email: undefined,
  first_name: undefined,
  last_name: undefined,
  default_currency: undefined,
  updateFirstName: (first_name) =>
    set(() => ({
      first_name: first_name,
    })),
  updateLastName: (last_name) =>
    set(() => ({
      last_name: last_name,
    })),
  updateDefaultCurrency: (default_currency) =>
    set(() => ({
      default_currency: default_currency,
    })),
}));
