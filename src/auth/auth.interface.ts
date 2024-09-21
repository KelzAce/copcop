import { User } from 'src/user/entities/user.entity';

export interface ILoginResponse {
  message: string;
  user: User;
  access_token: string;
  refresh_token: string;
}

export interface IHttpResponse {
  message: string;
}

export interface ISignupResponse {
  message: string;
  user: User;
}

export interface IJwtPayload {
  sub: number;
  email: string;
  iat: number;
  exp: number;
}

export interface IFilterException {
  statusCode: number;
  timestamp: string;
  path: string;
  message: string;
}

export interface IResetPassword {
  password: string;
}
