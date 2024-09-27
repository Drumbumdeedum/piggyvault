declare type User = {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  first_name: string;
  last_name: string;
};

declare type UpdateFirstNameProps = {
  user_id: string;
  first_name: string;
};

declare type UpdateLastNameRequest = {
  user_id: string;
  last_name: string;
};
