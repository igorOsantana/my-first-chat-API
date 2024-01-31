import { Inject } from '@nestjs/common';
import {
  CHAT_REPOSITORY,
  TChatRepository,
} from '../interfaces/repository.interface';
import {
  TFindAllChatUseCase,
  TFindAllChatUseCaseInput,
} from '../interfaces/use-case.interface';

export class FindAllChatUseCase implements TFindAllChatUseCase {
  constructor(
    @Inject(CHAT_REPOSITORY)
    private readonly chatRepository: TChatRepository,
  ) {}

  async execute(input: TFindAllChatUseCaseInput) {
    const chatList = await this.chatRepository.findAll(input);

    if (chatList.isLeft()) {
      throw chatList.exception;
    }

    return chatList.value;
  }
}
