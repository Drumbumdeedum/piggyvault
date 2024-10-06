import { create, StoreApi, UseBoundStore } from "zustand";

interface AccountsState {
  accounts: Account[] | [];
  updateAccountBalance: (id: string, newBalance: number) => void;
}

export const useAccounts: UseBoundStore<StoreApi<AccountsState>> =
  create<AccountsState>()((set, get) => ({
    accounts: [],
    updateAccountBalance: (id, newBalance) =>
      set((state) => ({
        accounts: state.accounts.map((account) => {
          return account.id === id
            ? { ...account, current_balance: newBalance }
            : account;
        }),
      })),
  }));
