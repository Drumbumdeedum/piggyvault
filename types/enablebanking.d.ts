declare type AccountConnection = {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  auth_code: string;
  session_id: string;
  valid_until: string;
};

declare type Country = {
  code: string;
  name: string;
  icon: string;
};

declare type Bank = {
  name: string;
  country: string;
  logo: string;
};

declare type Balance = {
  name: string;
  balance_amount: BalanceAmount;
  balance_type: string;
  last_change_date_time: string;
  reference_date: string;
  last_committed_transaction: string;
};

declare type BalanceAmount = {
  amount: string;
  currency: string;
};

declare type EnablebankingAccount = {
  account_id: {
    iban: string;
  };
  all_account_ids: AccountId[];
  account_servicer: {
    bic_fi: string;
    clearing_system_member_id: {
      clearing_system_id: string;
      member_id: number;
    };
    name: string;
  };
  name: string;
  details: string;
  usage: string;
  cash_account_type: string;
  product: string;
  currency: string;
  psu_status: string;
  credit_limit: {
    currency: string;
    amount: string;
  };
  legal_age: boolean;
  uid: string;
  identification_hash: string;
  identification_hashes: string[];
};

declare type AccountId = {
  identification: string;
  scheme_name: string;
};

declare type Balances = {
  balances: Balance[];
};
declare type Balance = {
  name: string;
  balance_amount: {
    currency: string;
    amount: string;
  };
  balance_type: string;
  last_change_date_time: string;
  reference_date: string;
  last_committed_transaction: string;
};

declare type CreateSessionResponse = {
  session_id: string;
  accounts: Account[];
  aspsp: Aspsp;
  psu_type: PSU_TYPE;
  access: {
    valid_until: string;
  };
};

declare type GetSessionResponse = {
  access: {
    valid_until: string;
  };
  accounts: string[];
  accounts_data: AccountsData[];
  aspsp: Aspsp;
  authorized: string;
  created: string;
  psu_type: PSU_TYPE;
  status: string;
};

declare type AccountsData = {
  identification_hash: "string";
  uid: "string";
};

declare type Aspsp = {
  name: string;
  country: string;
};

enum PSU_TYPE {
  business = "business",
  personal = "personal",
}

declare type CreateOrRetrieveSessionRequest = {
  user_id: string;
  auth_code: string;
  session_id?: string;
};

declare type Account = {
  id: string;
  created_at: string;
  updated_at: string;
  institution_name: string;
  country: string;
  product_name: string;
  currency: string;
  iban: string;
};
