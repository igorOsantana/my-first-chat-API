import { Inject } from '@nestjs/common';
import { FriendshipStatus } from '../friendship.entity';
import {
  FRIENDSHIP_REPOSITORY,
  TFriendshipRepository,
} from '../interfaces/repository.interface';
import { TFriendshipDefaultInput } from '../interfaces/shared.interface';
import { TDeclineFriendshipUseCase } from '../interfaces/use-case.interface';

export class DeclineFriendshipUseCase implements TDeclineFriendshipUseCase {
  constructor(
    @Inject(FRIENDSHIP_REPOSITORY)
    private readonly friendshipRepository: TFriendshipRepository,
  ) {}

  async execute(input: TFriendshipDefaultInput): Promise<void> {
    const friendship = await this.friendshipRepository.findByIds(input);

    if (friendship.isLeft()) {
      throw friendship.exception;
    }

    const result = await this.friendshipRepository.update({
      where: input,
      data: { status: FriendshipStatus.DECLINED },
    });

    if (result.isLeft()) {
      throw result.exception;
    }
  }
}
