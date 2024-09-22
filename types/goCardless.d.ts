declare type Country = {
  code: string;
  name: string;
  icon: string;
};

declare type Bank = {
  id: string;
  logo: string;
  name: string;
};

declare type ConnectBankaccountRequest = {
  userId: string;
  accessToken: string;
  institutionId: string;
};

declare type ConnectionLink = {
  link: string;
};

declare type ConnectionResponse = {
  ref: string;
};
