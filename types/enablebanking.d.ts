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
  identification_hash: string;
  uid: string;
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

declare type TransactionsResponse = {
  transactions: TransactionResponse[];
  continuation_key: string;
};

declare type TransactionResponse = {
  entry_reference: string;
  merchant_category_code: string;
  transaction_amount: {
    currency: string;
    amount: string;
  };
  creditor: {
    name: string;
    postal_address: {
      address_line: string[];
      address_type: string;
      building_number: string;
      country: string;
      country_sub_division: string;
      department: string;
      post_code: string;
      street_name: string;
      sub_department: string;
      town_name: string;
    };
  };
  creditor_account: {
    iban: string;
  };
  creditor_agent: {
    bic_fi: string;
    clearing_system_member_id: {
      clearing_system_id: string;
      member_id: number;
    };
    name: string;
  };
  debtor: {
    name: string;
    postal_address: {
      address_line: string[];
      address_type: string;
      building_number: string;
      country: string;
      country_sub_division: string;
      department: string;
      post_code: string;
      street_name: string;
      sub_department: string;
      town_name: string;
    };
  };
  debtor_account: {
    iban: string;
  };
  debtor_agent: {
    bic_fi: string;
    clearing_system_member_id: {
      clearing_system_id: string;
      member_id: number;
    };
    name: string;
  };
  bank_transaction_code: {
    description: string;
    code: string;
    sub_code: string;
  };
  credit_debit_indicator: string;
  status: string;
  booking_date: string;
  value_date: string;
  transaction_date: string;
  balance_after_transaction: {
    currency: string;
    amount: string;
  };
  reference_number: string;
  remittance_information: string[];
  debtor_account_additional_identification: {
    identification: string;
    scheme_name: string;
  };
  creditor_account_additional_identification: {
    identification: string;
    scheme_name: string;
  };
  exchange_rate: {
    unit_currency: string;
    exchange_rate: string;
    rate_type: string;
    contract_identification: string;
    instructed_amount: {
      currency: string;
      amount: string;
    };
  };
  note: string;
  transaction_id: string;
};
