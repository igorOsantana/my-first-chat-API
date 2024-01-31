import { Inject } from '@nestjs/common';
import {
  TUserRepository,
  USER_REPOSITORY,
} from '../../user/interfaces/repository.interface';
import { UserExceptions } from '../../user/user.exception';
import { AUTH_SERVICES, TAuthServices } from '../interfaces/service.interface';
import {
  TRegisterAuthUseCase,
  TRegisterAuthUseCaseInput,
  TSignInAuthUseCaseOutput,
} from '../interfaces/use-case.interface';

export class RegisterAuthUseCase implements TRegisterAuthUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: TUserRepository,
    @Inject(AUTH_SERVICES)
    private readonly authServices: TAuthServices,
  ) {}

  async execute(
    input: TRegisterAuthUseCaseInput,
  ): Promise<TSignInAuthUseCaseOutput> {
    const userWithSameEmail = await this.userRepository.findByEmail(
      input.email,
    );

    if (userWithSameEmail.isRight()) {
      throw UserExceptions.EmailInUse;
    }

    const newUser = await this.userRepository.create(input);

    if (newUser.isLeft()) {
      throw userWithSameEmail.exception;
    }

    return this.authServices.generateTokens(newUser.value);
  }
}
