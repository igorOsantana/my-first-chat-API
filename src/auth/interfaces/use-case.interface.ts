import { TUseCaseBase } from 'src/shared/interface.shared';

export const AUTH_USE_CASES = {
  SIGN_IN: Symbol('@AUTH_USE_CASES_SIGN_IN'),
  REGISTER: Symbol('@AUTH_USE_CASES_REGISTER'),
};

// SIGN IN
export type TSignInAuthUseCase = TUseCaseBase<
  TSignInAuthUseCaseInput,
  Promise<TSignInAuthUseCaseOutput>
>;
export type TSignInAuthUseCaseInput = {
  email: string;
  password: string;
};
export type TSignInAuthUseCaseOutput = {
  accessToken: string;
  refreshToken: string;
};

// REGISTER
export type TRegisterAuthUseCase = TUseCaseBase<
  TRegisterAuthUseCaseInput,
  Promise<TSignInAuthUseCaseOutput>
>;
export type TRegisterAuthUseCaseInput = {
  name: string;
  email: string;
  password: string;
};
