import { Inject } from '@nestjs/common';
import {
  TUserRepository,
  TUserRepositoryFindOneOutput,
  USER_REPOSITORY,
} from '../interfaces/repository.interface';
import {
  TFindByUserUseCase,
  TFindByUserUseCaseInput,
} from '../interfaces/use-case.interface';
import { UserEntity } from '../user.entity';

export class FindByUserUseCase implements TFindByUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: TUserRepository,
  ) {}

  async execute(input: TFindByUserUseCaseInput): Promise<UserEntity> {
    let findByMethod: (value: string) => Promise<TUserRepositoryFindOneOutput>;

    if (input.by === 'id') {
      findByMethod = this.userRepository.findById;
    } else if (input.by === 'email') {
      findByMethod = this.userRepository.findByEmail;
    } else if (input.by === 'idOrEmail') {
      findByMethod = this.userRepository.findByIdOrEmail;
    }

    const user = await findByMethod(input.value);

    if (user.isLeft()) {
      throw user.exception;
    }

    return user.value;
  }
}
