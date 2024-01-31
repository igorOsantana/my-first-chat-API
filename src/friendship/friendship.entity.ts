import { UserEntity } from 'src/user/user.entity';

export class FriendshipEntity {
  sender: UserEntity;
  senderId: string;
  recipient: UserEntity;
  recipientId: string;
  status: FriendshipStatus;
  createdAt: Date;
  updatedAt: Date;

  constructor(input: FriendshipEntity) {
    Object.assign(this, input);
  }
}

export enum FriendshipStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
}
