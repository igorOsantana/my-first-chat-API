import { UserEntityMock } from '../../user/mocks/entity.mock';
import { MessageEntity } from '../message.entity';

export class MessageEntityMock {
  static create(messageProps?: Partial<MessageEntity>) {
    const sender = UserEntityMock.create();
    return new MessageEntity({
      id: 'anyMessageId',
      content: 'any message',
      chatId: 'anyChatId',
      sender,
      senderId: sender.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...messageProps,
    });
  }
}
