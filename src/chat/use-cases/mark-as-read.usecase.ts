import { Inject } from '@nestjs/common';
import { ChatExceptions } from '../chat.exception';
import {
  CHAT_REPOSITORY,
  TChatRepository,
} from '../interfaces/repository.interface';
import {
  TMarkAsReadChatUseCase,
  TMarkAsReadChatUseCaseInput,
} from '../interfaces/use-case.interface';

export class MarkAsReadChatUseCase implements TMarkAsReadChatUseCase {
  constructor(
    @Inject(CHAT_REPOSITORY)
    private readonly chatRepository: TChatRepository,
  ) {}

  async execute(input: TMarkAsReadChatUseCaseInput) {
    const chat = await this.chatRepository.findById(input.id);

    if (chat.isLeft()) {
      throw chat.exception;
    }

    if (!chat.value.isParticipant(input.userId)) {
      throw ChatExceptions.NotFound;
    }

    const result = await this.chatRepository.markAsRead(input);

    if (result.isLeft()) {
      throw result.exception;
    }
  }
}
