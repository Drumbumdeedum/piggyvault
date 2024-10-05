"use client";

import { useEffect, useRef } from "react";
import { useUser } from "./user";

export default function InitUser({ user }: { user: User }) {
  const initState = useRef(false);

  useEffect(() => {
    if (!initState.current) {
      useUser.setState({ user });
    }
    initState.current = true;
  }, []);
  return <></>;
}
