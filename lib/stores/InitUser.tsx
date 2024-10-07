"use client";

import { useEffect, useRef } from "react";
import { useUser } from "./user";
import { readAccountsByUserId } from "../actions/enablebanking/db.actions";
import { useAccounts } from "./accounts";

export default function InitUser({ user }: { user: User }) {
  const initState = useRef(false);

  useEffect(() => {
    const initUser = async () => {
      useUser.setState({ user });
      const accounts = await readAccountsByUserId(user.id);
      if (accounts) {
        useAccounts.setState({ accounts });
      }
    };
    if (!initState.current) {
      initUser();
    }
    initState.current = true;
  }, []);
  return <></>;
}
