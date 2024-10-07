import { create, StoreApi, UseBoundStore } from "zustand";

interface AccountsState {
  accounts: Account[] | [];
  updateAccountBalance: (id: string, newBalance: number) => void;
  pushAccount: (account: Account) => void;
}

export const useAccounts: UseBoundStore<StoreApi<AccountsState>> =
  create<AccountsState>()((set, get) => ({
    accounts: [],
    pushAccount: (account: Account) =>
      set((state) => ({
        accounts: [...state.accounts, account],
      })),
    updateAccountBalance: (id, newBalance) =>
      set((state) => ({
        accounts: state.accounts.map((account) => {
          return account.id === id
            ? { ...account, current_balance: newBalance }
            : account;
        }),
      })),
  }));
