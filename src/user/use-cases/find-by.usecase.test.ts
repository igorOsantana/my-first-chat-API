import { Test } from '@nestjs/testing';
import { ApiException } from '../../shared/exception.shared';
import { Left, Right } from '../../shared/helpers.shared';
import {
  TUserRepository,
  USER_REPOSITORY,
} from '../interfaces/repository.interface';
import { TFindByUserUseCaseInput } from '../interfaces/use-case.interface';
import { UserEntityMock } from '../mocks/entity.mock';
import {
  UserRepositoryMock,
  getUserRepositorySpies,
} from '../mocks/repository.mock';
import { FindByUserUseCase } from './find-by.usecase';

describe('FindByUserUseCase', () => {
  let userRepository: TUserRepository;
  let sut: FindByUserUseCase;

  const anyException = new ApiException('any exception');

  function createPayload(): TFindByUserUseCaseInput {
    return {
      by: 'id',
      value: 'anyUserId',
    };
  }

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        FindByUserUseCase,
        { provide: USER_REPOSITORY, useClass: UserRepositoryMock },
      ],
    }).compile();

    userRepository = moduleRef.get<UserRepositoryMock>(USER_REPOSITORY);
    sut = moduleRef.get<FindByUserUseCase>(FindByUserUseCase);
  });

  test('it should call the findById method of the UserRepository with the sent value as a param if the "by" prop is "id"', async () => {
    const { findByIdSpy } = getUserRepositorySpies(userRepository);
    const payload = createPayload();

    await sut.execute(payload);

    expect(payload.by).toBe('id');
    expect(findByIdSpy).toHaveBeenCalledTimes(1);
    expect(findByIdSpy).toHaveBeenCalledWith(payload.value);
  });

  test('it should throw an exception if the findById method returns a Left value', () => {
    const { findByIdSpy } = getUserRepositorySpies(userRepository);
    findByIdSpy.mockResolvedValueOnce(new Left(anyException));
    const payload = createPayload();

    const result = sut.execute(payload);

    expect(payload.by).toBe('id');
    return expect(result).rejects.toThrowError(anyException);
  });

  test('it should call the findByEmail method of the UserRepository with the sent value as a param if the "by" prop is "email"', async () => {
    const { findByEmailSpy } = getUserRepositorySpies(userRepository);
    const payload = createPayload();
    payload.by = 'email';

    await sut.execute(payload);

    expect(payload.by).toBe('email');
    expect(findByEmailSpy).toHaveBeenCalledTimes(1);
    expect(findByEmailSpy).toHaveBeenCalledWith(payload.value);
  });

  test('it should throw an exception if the findByEmail method returns a Left value', () => {
    const { findByEmailSpy } = getUserRepositorySpies(userRepository);
    findByEmailSpy.mockResolvedValueOnce(new Left(anyException));
    const payload = createPayload();
    payload.by = 'email';

    const result = sut.execute(payload);

    expect(payload.by).toBe('email');
    return expect(result).rejects.toThrowError(anyException);
  });

  test('it should call the findByIdOrEmail method of the UserRepository with the sent value as a param if the "by" prop is "email"', async () => {
    const { findByIdOrEmailSpy } = getUserRepositorySpies(userRepository);
    const payload = createPayload();
    payload.by = 'idOrEmail';

    await sut.execute(payload);

    expect(payload.by).toBe('idOrEmail');
    expect(findByIdOrEmailSpy).toHaveBeenCalledTimes(1);
    expect(findByIdOrEmailSpy).toHaveBeenCalledWith(payload.value);
  });

  test('it should throw an exception if the findByIdOrEmail method returns a Left value', () => {
    const { findByIdOrEmailSpy } = getUserRepositorySpies(userRepository);
    findByIdOrEmailSpy.mockResolvedValueOnce(new Left(anyException));
    const payload = createPayload();
    payload.by = 'idOrEmail';

    const result = sut.execute(payload);

    expect(payload.by).toBe('idOrEmail');
    return expect(result).rejects.toThrowError(anyException);
  });

  test('it should return the found user', async () => {
    const foundUser = UserEntityMock.create();
    const { findByIdSpy } = getUserRepositorySpies(userRepository);
    findByIdSpy.mockResolvedValueOnce(new Right(foundUser));
    const payload = createPayload();

    const result = await sut.execute(payload);

    expect(result).toStrictEqual(foundUser);
  });
});
