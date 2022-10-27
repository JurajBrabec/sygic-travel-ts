type Credentials = {
  username: string;
  password: string;
};
type Tokens = {
  access_token: string;
  refresh_token: string;
};
type Token = Tokens & {
  expires_in: number;
  token_type: string;
};
type AuthBody = {
  client_id: string;
  device_code: string;
  device_platform: string;
  grant_type: string;
  username: string;
  password: string;
};
