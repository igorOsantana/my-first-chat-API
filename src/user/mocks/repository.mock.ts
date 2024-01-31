import { Right } from '../../shared/helpers.shared';
import {
  TUserRepository,
  TUserRepositoryCreateInput,
  TUserRepositoryFindOneOutput,
} from '../interfaces/repository.interface';
import { UserEntityMock } from './entity.mock';

export class UserRepositoryMock implements TUserRepository {
  create(
    input: TUserRepositoryCreateInput,
  ): Promise<TUserRepositoryFindOneOutput> {
    return Promise.resolve(new Right(UserEntityMock.create(input)));
  }

  findById(id: string): Promise<TUserRepositoryFindOneOutput> {
    return Promise.resolve(new Right(UserEntityMock.create({ id })));
  }

  findByEmail(email: string): Promise<TUserRepositoryFindOneOutput> {
    return Promise.resolve(new Right(UserEntityMock.create({ email })));
  }

  findByIdOrEmail(idOrEmail: string): Promise<TUserRepositoryFindOneOutput> {
    return Promise.resolve(
      new Right(
        UserEntityMock.create({
          id: idOrEmail,
          email: idOrEmail,
        }),
      ),
    );
  }
}

export function getUserRepositorySpies(userRepository: UserRepositoryMock) {
  return {
    createSpy: jest.spyOn(userRepository, 'create'),
    findByIdSpy: jest.spyOn(userRepository, 'findById'),
    findByEmailSpy: jest.spyOn(userRepository, 'findByEmail'),
    findByIdOrEmailSpy: jest.spyOn(userRepository, 'findByIdOrEmail'),
  };
}
