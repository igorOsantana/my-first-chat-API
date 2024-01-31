import { Test } from '@nestjs/testing';
import { ApiException } from '../../shared/exception.shared';
import { Left, Right } from '../../shared/helpers.shared';
import {
  TUserRepository,
  USER_REPOSITORY,
} from '../../user/interfaces/repository.interface';
import { UserEntityMock } from '../../user/mocks/entity.mock';
import {
  UserRepositoryMock,
  getUserRepositorySpies,
} from '../../user/mocks/repository.mock';
import { UserExceptions } from '../../user/user.exception';
import { AUTH_SERVICES, TAuthServices } from '../interfaces/service.interface';
import {
  TRegisterAuthUseCaseInput,
  TSignInAuthUseCaseOutput,
} from '../interfaces/use-case.interface';
import { AuthServicesMock, getAuthServicesSpies } from '../mocks/service.mock';
import { RegisterAuthUseCase } from './register.usecase';

describe('RegisterAuthUseCase', () => {
  let userRepository: TUserRepository;
  let authServices: TAuthServices;
  let sut: RegisterAuthUseCase;

  const anyException = new ApiException('any exception');

  function createPayload(): TRegisterAuthUseCaseInput {
    return {
      name: 'any user name',
      email: 'anyuser@mail.com',
      password: 'anyPassword',
    };
  }

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        RegisterAuthUseCase,
        { provide: USER_REPOSITORY, useClass: UserRepositoryMock },
        { provide: AUTH_SERVICES, useClass: AuthServicesMock },
      ],
    }).compile();

    userRepository = moduleRef.get<UserRepositoryMock>(USER_REPOSITORY);
    authServices = moduleRef.get<AuthServicesMock>(AUTH_SERVICES);
    sut = moduleRef.get<RegisterAuthUseCase>(RegisterAuthUseCase);
  });

  beforeEach(() => {
    const { findByEmailSpy } = getUserRepositorySpies(userRepository);
    findByEmailSpy.mockResolvedValue(new Left(anyException));
  });

  test('it should call the findByEmail method of the UserRepository with the sent email as a param', async () => {
    const { findByEmailSpy } = getUserRepositorySpies(userRepository);
    const payload = createPayload();

    await sut.execute(payload);

    expect(findByEmailSpy).toHaveBeenCalledTimes(1);
    expect(findByEmailSpy).toHaveBeenCalledWith(payload.email);
  });

  test('it should throw the EmailInUse exception if the findByEmail method returns a Right value', () => {
    const { findByEmailSpy } = getUserRepositorySpies(userRepository);
    findByEmailSpy.mockResolvedValueOnce(new Right(UserEntityMock.create()));

    const payload = createPayload();

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
    const { createSpy } = getUserRepositorySpies(userRepository);
    createSpy.mockResolvedValueOnce(new Left(anyException));

    const payload = createPayload();

    const result = sut.execute(payload);

    return expect(result).rejects.toThrowError(anyException);
  });

  test('it should call the generateTokens method of the AuthServices with the created user as a param', async () => {
    const createdUser = UserEntityMock.create();
    const { createSpy } = getUserRepositorySpies(userRepository);
    createSpy.mockResolvedValueOnce(new Right(createdUser));
    const { generateTokensSpy } = getAuthServicesSpies(authServices);
    const payload = createPayload();

    await sut.execute(payload);

    expect(generateTokensSpy).toHaveBeenCalledTimes(1);
    expect(generateTokensSpy).toHaveBeenCalledWith(createdUser);
  });

  test('it should return the accessToken and refreshToken', async () => {
    const expectedOutput: TSignInAuthUseCaseOutput = {
      accessToken: 'anyAccessToken',
      refreshToken: 'anyRefreshToken',
    };
    const { generateTokensSpy } = getAuthServicesSpies(authServices);
    generateTokensSpy.mockReturnValueOnce(expectedOutput);

    const payload = createPayload();

    const result = await sut.execute(payload);

    expect(result).toStrictEqual(expectedOutput);
  });
});
