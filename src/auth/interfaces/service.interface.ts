import { UserEntity } from 'src/user/user.entity';

export const AUTH_SERVICES = Symbol('@AUTH_SERVICES');

export type TAuthServices = {
  hash(input: string): Promise<string>;
  compare(input: string, hash: string): Promise<boolean>;
  generateTokens(user: UserEntity): TAuthServicesGenerateTokensOutput;
  verifyToken(token: string): TAuthServicesToken;
};

// TOKEN
export type TAuthServicesToken = {
  sub: string;
  username: string;
};

// GENERATE TOKENS
export type TAuthServicesGenerateTokensOutput = {
  accessToken: string;
  refreshToken: string;
};
