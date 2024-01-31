import { TUseCaseBase } from 'src/shared/interface.shared';
import { UserEntity } from '../user.entity';
import { TUserRepositoryCreateInput } from './repository.interface';

export const USER_USE_CASES = {
  CREATE: Symbol('@USER_USE_CASES_CREATE'),
  FIND_BY: Symbol('@USER_USE_CASES_FIND_BY'),
};

// CREATE
export type TCreateUserUseCase = TUseCaseBase<
  TUserRepositoryCreateInput,
  Promise<UserEntity>
>;
export type TCreateUserUseCaseInput = TUserRepositoryCreateInput;

// FIND BY
export type TFindByUserUseCase = TUseCaseBase<
  TFindByUserUseCaseInput,
  Promise<UserEntity>
>;
export type TFindByUserUseCaseInput = {
  by: 'id' | 'email' | 'idOrEmail';
  value: string;
};
