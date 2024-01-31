import { Inject } from '@nestjs/common';
import {
  MESSAGE_REPOSITORY,
  TMessageRepository,
} from '../interfaces/repository.interface';
import {
  TMessageUseCaseFindAll,
  TMessageUseCaseFindAllInput,
  TMessageUseCaseFindAllOutput,
} from '../interfaces/use-case.interface';

export class MessageUseCaseFindAll implements TMessageUseCaseFindAll {
  constructor(
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: TMessageRepository,
  ) {}

  async execute(
    input: TMessageUseCaseFindAllInput,
  ): Promise<TMessageUseCaseFindAllOutput> {
    const list = await this.messageRepository.findAll(input);

    if (list.isLeft()) {
      throw list.exception;
    }

    return list.value;
  }
}
