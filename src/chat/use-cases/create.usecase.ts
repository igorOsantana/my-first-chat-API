import { Inject } from '@nestjs/common';
import {
  TUserRepository,
  USER_REPOSITORY,
} from '../../user/interfaces/repository.interface';
import { ChatExceptions } from '../chat.exception';
import {
  CHAT_REPOSITORY,
  TChatRepository,
} from '../interfaces/repository.interface';
import {
  TCreateChatUseCase,
  TCreateChatUseCaseInput,
} from '../interfaces/use-case.interface';

export class CreateChatUseCase implements TCreateChatUseCase {
  constructor(
    @Inject(CHAT_REPOSITORY)
    private readonly chatRepository: TChatRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: TUserRepository,
  ) {}

  async execute(input: TCreateChatUseCaseInput) {
    await this.validateInput(input);

    const newChat = await this.chatRepository.create(input);

    if (newChat.isLeft()) {
      throw newChat.exception;
    }

    return newChat.value;
  }

  private async validateInput(input: TCreateChatUseCaseInput) {
    const chatAlreadyExists = await this.chatRepository.findByParticipants([
      input.recipientId,
      input.senderId,
    ]);

    if (chatAlreadyExists.isRight()) {
      throw ChatExceptions.AlreadyExists;
    }

    const recipientExists = await this.userRepository.findById(
      input.recipientId,
    );

    if (recipientExists.isLeft()) {
      throw ChatExceptions.RecipientNotFound;
    }
  }
}
