import { Inject } from '@nestjs/common';
import {
  CHAT_REPOSITORY,
  TChatRepository,
} from '../../chat/interfaces/repository.interface';
import {
  MESSAGE_REPOSITORY,
  TMessageRepository,
} from '../interfaces/repository.interface';
import {
  TMessageUseCaseSend,
  TMessageUseCaseSendInput,
  TMessageUseCaseSendOutput,
} from '../interfaces/use-case.interface';

export class MessageUseCaseSend implements TMessageUseCaseSend {
  constructor(
    @Inject(CHAT_REPOSITORY)
    private readonly chatRepository: TChatRepository,
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: TMessageRepository,
  ) {}

  async execute(
    input: TMessageUseCaseSendInput,
  ): Promise<TMessageUseCaseSendOutput> {
    const chat = await this.chatRepository.findById(input.chatId);

    if (chat.isLeft()) {
      throw chat.exception;
    }

    const newMessage = await this.messageRepository.create(input);

    if (newMessage.isLeft()) {
      throw newMessage.exception;
    }

    return newMessage.value;
  }
}
