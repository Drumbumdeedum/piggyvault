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

declare type Requisition = {
  id: string;
  createdAt: string;
  updatedAt: string;
  accountSelection: boolean;
  agreement: string;
  institutionId: string;
  link: string;
  redirect: string;
  redirectImmediate: boolean;
  reference: string;
  status: string;
  ssn: string;
  accounts: string[];
};

declare type SaveRequisitionRequest = {
  id: string;
  accountSelection: boolean;
  agreement: string;
  institutionId: string;
  link: string;
  redirect: string;
  redirectImmediate: boolean;
  reference: string;
  status: string;
  ssn: string;
  accounts: string[];
};

declare type CreateOrGetRequisitionRequest = {
  userId: string;
  accessToken: string;
  institutionId: string;
};

declare type ConnectNewAccountRequest = {
  userId: string;
  accessToken: string;
  institutionId: string;
};

declare type ConnectionLink = {
  link: string;
};
