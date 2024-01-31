/* eslint-disable @typescript-eslint/no-unused-vars */
import { UserEntity } from '../../user/user.entity';
import {
  TAuthServices,
  TAuthServicesGenerateTokensOutput,
  TAuthServicesToken,
} from '../interfaces/service.interface';

export class AuthServicesMock implements TAuthServices {
  async hash(input: string): Promise<string> {
    return 'anyHash';
  }

  async compare(_input: string, _hash: string): Promise<boolean> {
    return true;
  }

  verifyToken(_token: string): TAuthServicesToken {
    return {
      sub: 'anyUserId',
      username: 'any user name',
    };
  }

  generateTokens(_user: UserEntity): TAuthServicesGenerateTokensOutput {
    return {
      accessToken: 'anyAccessToken',
      refreshToken: 'anyRefreshToken',
    };
  }
}

export function getAuthServicesSpies(authService: AuthServicesMock) {
  return {
    compareSpy: jest.spyOn(authService, 'compare'),
    generateTokensSpy: jest.spyOn(authService, 'generateTokens'),
  };
}
