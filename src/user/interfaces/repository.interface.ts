import { ApiException } from 'src/shared/exception.shared';
import { TEither } from 'src/shared/interface.shared';
import { UserEntity } from '../user.entity';

export const USER_REPOSITORY = Symbol('@USER_REPOSITORY');

export type TUserRepository = {
  create(
    input: TUserRepositoryCreateInput,
  ): Promise<TUserRepositoryFindOneOutput>;
  findById(id: string): Promise<TUserRepositoryFindOneOutput>;
  findByEmail(email: string): Promise<TUserRepositoryFindOneOutput>;
  findByIdOrEmail(idOrEmail: string): Promise<TUserRepositoryFindOneOutput>;
};

// CREATE
export type TUserRepositoryCreateInput = {
  name: string;
  email: string;
  password: string;
};

// FIND ONE
export type TUserRepositoryFindOneOutput = TEither<ApiException, UserEntity>;
