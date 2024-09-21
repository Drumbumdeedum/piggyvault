declare interface PlaidLinkProps {
  user: User;
  variant?: "primary" | "ghost";
}

declare type Bank = {
  id: string;
  userId: string;
  bankId: string;
  accountId: string;
  accessToken: string;
};

declare interface ExchangePublicTokenProps {
  publicToken: string;
  user: User;
}

declare interface CreateBankAccountProps {
  userId: string;
  bankId: string;
  accountId: string;
  accessToken: string;
}

declare interface GetAccountsProps {
  userId: string;
}

declare interface GetBanksProps {
  userId: string;
}

declare interface GetInstitutionProps {
  institutionId: string;
}

declare interface TotlaBalanceBoxProps {
  accounts: Account[];
  totalBanks: number;
  totalCurrentBalance: number;
}

declare interface DoughnutChartProps {
  accounts: Account[];
}
