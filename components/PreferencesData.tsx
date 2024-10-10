"use client";

import { useUser } from "@/lib/stores/user";
import PreferencesDataForm from "./PreferencesDataForm";

const PreferencesData = () => {
  const default_currency = useUser((state) => state.default_currency);
  if (!default_currency) return;

  return <PreferencesDataForm default_currency={default_currency} />;
};

export default PreferencesData;
