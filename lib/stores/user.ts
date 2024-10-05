import { create } from "zustand";

interface UserState {
  user:
    | {
        id: string;
        email: string;
        created_at: string;
        updated_at: string;
        synced_at: string;
        first_name: string;
        last_name: string;
      }
    | undefined;
}

export const useUser = create<UserState>()((set) => ({
  user: undefined,
}));
