import { Test } from '@nestjs/testing';
import { ApiException } from '../../shared/exception.shared';
import { Left, Right } from '../../shared/helpers.shared';
import {
  TUserRepository,
  USER_REPOSITORY,
} from '../../user/interfaces/repository.interface';
import {
  UserRepositoryMock,
  getUserRepositorySpies,
} from '../../user/mocks/repository.mock';
import { TCreateUserUseCaseInput } from '../interfaces/use-case.interface';
import { UserEntityMock } from '../mocks/entity.mock';
import { UserExceptions } from '../user.exception';
import { CreateUserUseCase } from './create.usecase';

describe('CreateUserUseCase', () => {
  let userRepository: TUserRepository;
  let sut: CreateUserUseCase;

  const anyException = new ApiException('any exception');

  function createPayload(): TCreateUserUseCaseInput {
    return {
      name: 'any user name',
      email: 'anyuser@mail.com',
      password: 'anyPassword',
    };
  }

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        { provide: USER_REPOSITORY, useClass: UserRepositoryMock },
      ],
    }).compile();

    userRepository = moduleRef.get<UserRepositoryMock>(USER_REPOSITORY);
    sut = moduleRef.get<CreateUserUseCase>(CreateUserUseCase);
  });

  beforeEach(() => {
    const { findByEmailSpy } = getUserRepositorySpies(userRepository);
    findByEmailSpy.mockResolvedValue(new Left(undefined));
  });

  test('it should call the findByEmail method of the UserRepository with the sent email as a param', async () => {
    const { findByEmailSpy } = getUserRepositorySpies(userRepository);
    const payload = createPayload();

    await sut.execute(payload);

    expect(findByEmailSpy).toHaveBeenCalledTimes(1);
    expect(findByEmailSpy).toHaveBeenCalledWith(payload.email);
  });

  test('it should throw the EmailInUse exception if the findByEmail method returns a Right value', () => {
    const anyUser = UserEntityMock.create();
    const { findByEmailSpy } = getUserRepositorySpies(userRepository);
    findByEmailSpy.mockResolvedValueOnce(new Right(anyUser));
    const payload = createPayload();
    payload.email = anyUser.email;

    const result = sut.execute(payload);

    return expect(result).rejects.toThrowError(UserExceptions.EmailInUse);
  });

  test('it should call the create method of the UserRepository with the sent payload as params', async () => {
    const { createSpy } = getUserRepositorySpies(userRepository);
    const payload = createPayload();

    await sut.execute(payload);

    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(createSpy).toHaveBeenCalledWith(payload);
  });

  test('it should throw an exception if the create method returns a Left value', () => {
    const anyUser = UserEntityMock.create();
    const { createSpy } = getUserRepositorySpies(userRepository);
    createSpy.mockResolvedValueOnce(new Left(anyException));
    const payload = createPayload();
    payload.email = anyUser.email;

    const result = sut.execute(payload);

    return expect(result).rejects.toThrowError(anyException);
  });

  test('it should return the created user', async () => {
    const createdUser = UserEntityMock.create();
    const { createSpy } = getUserRepositorySpies(userRepository);
    createSpy.mockResolvedValueOnce(new Right(createdUser));
    const payload = createPayload();

    const result = await sut.execute(payload);

    expect(result).toStrictEqual(createdUser);
  });
});
