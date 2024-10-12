declare type Transaction = {
  id: string;
  composite_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
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
  category: string;
};
