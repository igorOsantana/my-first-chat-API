import { Inject } from '@nestjs/common';
import {
  CHAT_REPOSITORY,
  TChatRepository,
} from '../interfaces/repository.interface';
import { TFindByIdChatUseCase } from '../interfaces/use-case.interface';

export class FindByIdChatUseCase implements TFindByIdChatUseCase {
  constructor(
    @Inject(CHAT_REPOSITORY)
    private readonly chatRepository: TChatRepository,
  ) {}

  async execute(id: string) {
    const foundChat = await this.chatRepository.findById(id);

    if (foundChat.isLeft()) {
      throw foundChat.exception;
    }

    return foundChat.value;
  }
}
