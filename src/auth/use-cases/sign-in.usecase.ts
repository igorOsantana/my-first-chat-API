import { Inject } from '@nestjs/common';
import {
  TUserRepository,
  USER_REPOSITORY,
} from '../../user/interfaces/repository.interface';
import { AuthExceptions } from '../auth.exception';
import { AUTH_SERVICES, TAuthServices } from '../interfaces/service.interface';
import {
  TSignInAuthUseCase,
  TSignInAuthUseCaseInput,
  TSignInAuthUseCaseOutput,
} from '../interfaces/use-case.interface';

export class SignInAuthUseCase implements TSignInAuthUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: TUserRepository,
    @Inject(AUTH_SERVICES)
    private readonly authServices: TAuthServices,
  ) {}

  async execute(
    input: TSignInAuthUseCaseInput,
  ): Promise<TSignInAuthUseCaseOutput> {
    const user = await this.userRepository.findByEmail(input.email);

    if (user.isLeft()) {
      throw AuthExceptions.InvalidCredentials;
    }

    const matchPasswords = await this.authServices.compare(
      input.password,
      user.value.password,
    );

    if (!matchPasswords) {
      throw AuthExceptions.InvalidCredentials;
    }

    return this.authServices.generateTokens(user.value);
  }
}
