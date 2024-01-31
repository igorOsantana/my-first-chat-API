import { ApiProperty } from '@nestjs/swagger';
import { TPaginationOutput } from 'src/shared/interface.shared';
import { UserPresenter } from 'src/user/user.presenter';
import { FriendshipEntity, FriendshipStatus } from './friendship.entity';

export class FriendshipPresenter {
  @ApiProperty()
  sender: UserPresenter;
  @ApiProperty()
  recipient: UserPresenter;
  @ApiProperty()
  status: FriendshipStatus;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;

  constructor(friendship: FriendshipEntity) {
    this.sender = friendship.sender;
    this.recipient = friendship.recipient;
    this.status = friendship.status;
    this.createdAt = friendship.createdAt;
    this.updatedAt = friendship.updatedAt;
  }
}

export class MyFriendsFriendshipPresenter {
  @ApiProperty({ isArray: true, type: UserPresenter })
  friends: UserPresenter[];

  constructor(userId: string, response: TPaginationOutput<FriendshipEntity>) {
    this.friends = response.list.map((friendship) =>
      friendship.sender.id === userId
        ? friendship.recipient
        : friendship.sender,
    );
  }
}

export class RequestsFriendshipPresenter {
  @ApiProperty({ isArray: true, type: UserPresenter })
  requests: UserPresenter[];

  constructor(response: TPaginationOutput<FriendshipEntity>) {
    this.requests = response.list.map((friendship) => friendship.sender);
  }
}
