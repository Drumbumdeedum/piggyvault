declare type Account = {
  id: string;
  created_at: string;
  updated_at: string;
  synced_at: string;
  account_uid: string;
  user_id: string;
  iban: string;
  institution_name: string;
  country: string;
  currency: string;
  product_name: string;
  account_id: string;
  current_balance: number;
  balance_name: string;
  account_type: ACCOUNT_TYPE;
};

enum ACCOUNT_TYPE {
  bank_account = "bank_account",
  cash_account = "cash_account",
  savings_account = "savings_account",
}

declare type CreateAccountProps = {
  user_id: string;
  institution_name: string;
  country: string;
  product_name: string;
  currency: string;
  iban: string;
  account_uid: string;
  account_id: string;
  account_type: string;
};

declare type UpdateAccountBalanceProps = {
  current_balance: number;
  balance_name: string;
  user_id: string;
  account_id: string;
};
