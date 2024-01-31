import { Message, User } from '@prisma/client';
import { MessageEntity } from './message.entity';

export class MessageRepositoryAdapter {
  static exec<T extends TInput | TInput[]>(
    input: T,
  ): T extends Array<any> ? MessageEntity[] : MessageEntity;
  static exec(input: TInput | TInput[]): MessageEntity[] | MessageEntity {
    if (Array.isArray(input)) {
      return this.adaptList(input);
    }
    return this.adapt(input);
  }

  private static adaptList(input: TInput[]) {
    return input.map(this.adapt);
  }

  private static adapt(input: TInput) {
    return new MessageEntity({
      id: input.id,
      sender: input.sender,
      senderId: input.senderId,
      chatId: input.chatId,
      content: input.content,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
    });
  }
}

type TInput = Message &
  Partial<{
    sender: User;
  }>;
