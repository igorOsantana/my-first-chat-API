import { Inject } from '@nestjs/common';
import {
  FRIENDSHIP_REPOSITORY,
  TFriendshipRepository,
} from '../interfaces/repository.interface';
import {
  TFindAllFriendshipUseCaseOutput,
  TFindAllMyFriendsFriendshipUseCase,
  TFindAllMyFriendsFriendshipUseCaseInput,
} from '../interfaces/use-case.interface';

export class FindAllMyFriendsFriendshipUseCase
  implements TFindAllMyFriendsFriendshipUseCase
{
  constructor(
    @Inject(FRIENDSHIP_REPOSITORY)
    private readonly friendshipRepository: TFriendshipRepository,
  ) {}

  async execute(
    input: TFindAllMyFriendsFriendshipUseCaseInput,
  ): Promise<TFindAllFriendshipUseCaseOutput> {
    const myFriends = await this.friendshipRepository.findAllMyFriends(input);

    if (myFriends.isLeft()) {
      throw myFriends.exception;
    }

    return myFriends.value;
  }
}
