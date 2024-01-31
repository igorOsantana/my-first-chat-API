import { Inject } from '@nestjs/common';
import { FriendshipEntity } from '../friendship.entity';
import { FriendshipExceptions } from '../friendship.exception';
import {
  FRIENDSHIP_REPOSITORY,
  TFriendshipRepository,
} from '../interfaces/repository.interface';
import { TFriendshipDefaultInput } from '../interfaces/shared.interface';
import { TCreateFriendshipUseCase } from '../interfaces/use-case.interface';

export class CreateFriendshipUseCase implements TCreateFriendshipUseCase {
  constructor(
    @Inject(FRIENDSHIP_REPOSITORY)
    private readonly friendshipRepository: TFriendshipRepository,
  ) {}

  async execute(input: TFriendshipDefaultInput): Promise<FriendshipEntity> {
    const friendshipAlreadyExists =
      await this.friendshipRepository.findByIds(input);

    if (friendshipAlreadyExists.isRight()) {
      throw FriendshipExceptions.AlreadyExists;
    }

    const newFriendship = await this.friendshipRepository.create(input);

    if (newFriendship.isLeft()) {
      throw newFriendship.exception;
    }

    return newFriendship.value;
  }
}
