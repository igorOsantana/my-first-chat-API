import { $Enums, Friendship, User } from '@prisma/client';
import { FriendshipEntity, FriendshipStatus } from './friendship.entity';

export class FriendshipRepositoryAdapter {
  static exec<T extends TInput | TInput[]>(
    input: T,
  ): T extends Array<any> ? FriendshipEntity[] : FriendshipEntity;
  static exec(input: TInput | TInput[]): FriendshipEntity[] | FriendshipEntity {
    if (Array.isArray(input)) {
      return this.adaptList(input);
    }
    return this.adapt(input);
  }

  private static adaptList(input: TInput[]) {
    return input.map(this.adapt);
  }

  private static adapt(input: TInput) {
    return new FriendshipEntity({
      sender: input.sender,
      senderId: input.senderId,
      recipient: input.recipient,
      recipientId: input.recipientId,
      status: this.adaptStatus(input.status),
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
    });
  }

  private static adaptStatus(
    status: $Enums.FriendshipStatus,
  ): FriendshipStatus {
    switch (status) {
      case $Enums.FriendshipStatus.PENDING:
        return FriendshipStatus.PENDING;
      case $Enums.FriendshipStatus.ACCEPTED:
        return FriendshipStatus.ACCEPTED;
      case $Enums.FriendshipStatus.DECLINED:
        return FriendshipStatus.DECLINED;
    }
  }
}

type TInput = Friendship &
  Partial<{
    sender: User;
    recipient: User;
  }>;
