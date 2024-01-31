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
import { AuthExceptions } from '../auth.exception';
import { AUTH_SERVICES, TAuthServices } from '../interfaces/service.interface';
import {
  TSignInAuthUseCaseInput,
  TSignInAuthUseCaseOutput,
} from '../interfaces/use-case.interface';
import { AuthServicesMock, getAuthServicesSpies } from '../mocks/service.mock';
import { SignInAuthUseCase } from './sign-in.usecase';

describe('SignInAuthUseCase', () => {
  let userRepository: TUserRepository;
  let authServices: TAuthServices;
  let sut: SignInAuthUseCase;

  const anyException = new ApiException('any exception');

  function createPayload(): TSignInAuthUseCaseInput {
    return {
      email: 'anyuser@mail.com',
      password: 'anyPassword',
    };
  }

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SignInAuthUseCase,
        { provide: USER_REPOSITORY, useClass: UserRepositoryMock },
        { provide: AUTH_SERVICES, useClass: AuthServicesMock },
      ],
    }).compile();

    userRepository = moduleRef.get<UserRepositoryMock>(USER_REPOSITORY);
    authServices = moduleRef.get<AuthServicesMock>(AUTH_SERVICES);
    sut = moduleRef.get<SignInAuthUseCase>(SignInAuthUseCase);
  });

  test('it should call the findByEmail method of the UserRepository with the sent email as a param', async () => {
    const { findByEmailSpy } = getUserRepositorySpies(userRepository);
    const payload = createPayload();

    await sut.execute(payload);

    expect(findByEmailSpy).toHaveBeenCalledTimes(1);
    expect(findByEmailSpy).toHaveBeenCalledWith(payload.email);
  });

  test('it should throw the InvalidCredentials exception if the findByEmail method returns a Left value', () => {
    const { findByEmailSpy } = getUserRepositorySpies(userRepository);
    findByEmailSpy.mockResolvedValueOnce(new Left(anyException));
    const payload = createPayload();

    const result = sut.execute(payload);

    return expect(result).rejects.toThrowError(
      AuthExceptions.InvalidCredentials,
    );
  });

  test('it should call the compare method of the AuthServices with the sent password and user password as params', async () => {
    const user = UserEntityMock.create();
    const { findByEmailSpy } = getUserRepositorySpies(userRepository);
    findByEmailSpy.mockResolvedValueOnce(new Right(user));
    const { compareSpy } = getAuthServicesSpies(authServices);
    const payload = createPayload();

    await sut.execute(payload);

    expect(compareSpy).toHaveBeenCalledTimes(1);
    expect(compareSpy).toHaveBeenCalledWith(payload.password, user.password);
  });

  test('it should throw the InvalidCredentials exception if the compare method returns false', () => {
    const { compareSpy } = getAuthServicesSpies(authServices);
    compareSpy.mockResolvedValueOnce(false);
    const payload = createPayload();

    const result = sut.execute(payload);

    return expect(result).rejects.toThrowError(
      AuthExceptions.InvalidCredentials,
    );
  });

  test('it should call the generateTokens method of the AuthServices with the found user as a param', async () => {
    const user = UserEntityMock.create();
    const { findByEmailSpy } = getUserRepositorySpies(userRepository);
    findByEmailSpy.mockResolvedValueOnce(new Right(user));
    const { generateTokensSpy } = getAuthServicesSpies(authServices);
    const payload = createPayload();

    await sut.execute(payload);

    expect(generateTokensSpy).toHaveBeenCalledTimes(1);
    expect(generateTokensSpy).toHaveBeenCalledWith(user);
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
