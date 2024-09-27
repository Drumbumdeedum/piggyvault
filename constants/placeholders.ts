export const ghostBanks = new Array(20).fill(0).map(() => {
  return {
    logo: "",
    name: "",
    country: "",
  };
});

export const ghostAccounts = [
  {
    account_id: {
      iban: "",
    },
    all_account_ids: [
      {
        identification: "",
        scheme_name: "",
      },
    ],
    account_servicer: {
      bic_fi: "",
      clearing_system_member_id: {
        clearing_system_id: "",
        member_id: 0,
      },
      name: "",
    },
    name: "",
    details: "",
    usage: "",
    cash_account_type: "",
    product: "",
    currency: "",
    psu_status: "",
    credit_limit: {
      currency: "",
      amount: "",
    },
    legal_age: true,
    uid: "",
    identification_hash: "",
    identification_hashes: [""],
  },
];
