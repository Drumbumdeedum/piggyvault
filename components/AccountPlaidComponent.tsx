"use client";

import React from "react";
import PlaidLink from "./PlaidLink";

const AccountPlaidComponent = ({ user }: { user: User }) => {
  return <PlaidLink user={user} variant="primary" />;
};

export default AccountPlaidComponent;
