import { UserEntityMock } from '../../user/mocks/entity.mock';
import { ChatEntity } from '../chat.entity';

export class ChatEntityMock {
  static create(chatProps?: Partial<ChatEntity>) {
    const id = 'anyChatId';
    const user1 = UserEntityMock.create();
    const user2 = UserEntityMock.create();
    const participants = [
      { chatId: id, user: user1, userId: user1.id, read: true },
      { chatId: id, user: user2, userId: user2.id, read: false },
    ];
    return new ChatEntity({
      id,
      lastMsg: 'any last message',
      participants,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...chatProps,
    });
  }
}
