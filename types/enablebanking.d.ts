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

declare type BalancesResponse = {
  balances: BalanceResponse[];
};

declare type BalanceResponse = {
  name: string;
  balance_amount: BalanceAmountResponse;
  balance_type: string;
  last_change_date_time: string;
  reference_date: string;
  last_committed_transaction: string;
};

declare type BalanceAmountResponse = {
  amount: string;
  currency: string;
};

declare type GetAccountDetailResponse = {
  account_id: {
    iban: string;
  };
  all_account_ids: AccountIdResponse[];
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

declare type AccountIdResponse = {
  identification: string;
  scheme_name: string;
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
  accounts_data: AccountsDataResponse[];
  aspsp: AspspResponse;
  authorized: string;
  created: string;
  psu_type: PSU_TYPE;
  status: string;
};

enum PSU_TYPE {
  business = "business",
  personal = "personal",
}

declare type AccountsDataResponse = {
  identification_hash: "string";
  uid: "string";
};

declare type AspspResponse = {
  name: string;
  country: string;
};

declare type CreateOrRetrieveSessionRequest = {
  user_id: string;
  auth_code: string;
  session_id?: string;
};
