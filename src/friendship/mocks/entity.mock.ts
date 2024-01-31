import { UserEntityMock } from '../../user/mocks/entity.mock';
import { FriendshipEntity, FriendshipStatus } from '../friendship.entity';

export class FriendshipEntityMock {
  static create(friendshipProps?: Partial<FriendshipEntity>) {
    const sender = UserEntityMock.create();
    const recipient = UserEntityMock.create();
    return new FriendshipEntity({
      sender,
      senderId: sender.id,
      recipient,
      recipientId: recipient.id,
      status: FriendshipStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...friendshipProps,
    });
  }
}
