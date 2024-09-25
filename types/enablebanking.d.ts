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

declare type Account = {
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
