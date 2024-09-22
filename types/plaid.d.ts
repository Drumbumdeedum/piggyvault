declare interface PlaidLinkProps {
  user: User;
  variant?: "primary" | "ghost";
}

declare type Bank = {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  bankId: string;
  accountId: string;
  accessToken: string;
  mask: string;
  name: string;
  officialName: string;
  persistentAccountId: string;
  subtype: string;
  type: string;
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
  mask: string | null;
  name: string;
  officialName: string | null;
  persistentAccountId?: string;
  subtype: string | null;
  type: string;
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
