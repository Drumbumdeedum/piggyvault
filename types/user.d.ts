declare type User = {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  synced_at: string;
  first_name: string;
  last_name: string;
  default_currency?: string;
};

declare type UpdateFirstNameProps = {
  user_id: string;
  first_name: string;
};

declare type UpdateLastNameProps = {
  user_id: string;
  last_name: string;
};

declare type UpdateDefaultCurrencyProps = {
  user_id: string;
  default_currency: string;
};
