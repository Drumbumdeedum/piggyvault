"use client";

import { redirect } from "next/navigation";

const page = () => {
  redirect("account/login-details");
};

export default page;
