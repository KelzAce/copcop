export type VerifyAccountResponse = {
  status: boolean;
  detail: string;
  account_data: { account_number: string; account_name: string };
};

export type VerifyBvnResponse = {
  status: boolean;
  detail: string;
  response_code: string;
  bvn_data: {
    firstName: string;
    middleName: string;
    lastName: string;
    dateOfBirth: string;
    phoneNumber: string;
  };
  source: string;
  user_info: any | null;
  request_data: { number: string };
};
