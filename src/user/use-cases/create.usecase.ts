import { Inject } from '@nestjs/common';
import {
  TUserRepository,
  TUserRepositoryCreateInput,
  USER_REPOSITORY,
} from '../interfaces/repository.interface';
import { TCreateUserUseCase } from '../interfaces/use-case.interface';
import { UserEntity } from '../user.entity';
import { UserExceptions } from '../user.exception';

export class CreateUserUseCase implements TCreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: TUserRepository,
  ) {}

  async execute(input: TUserRepositoryCreateInput): Promise<UserEntity> {
    const emailInUse = await this.userRepository.findByEmail(input.email);

    if (emailInUse.isRight()) {
      throw UserExceptions.EmailInUse;
    }

    const newUser = await this.userRepository.create(input);

    if (newUser.isLeft()) {
      throw newUser.exception;
    }

    return newUser.value;
  }
}
