import { Inject } from '@nestjs/common';
import {
  FRIENDSHIP_REPOSITORY,
  TFriendshipRepository,
} from '../interfaces/repository.interface';
import {
  TFindAllFriendshipUseCaseOutput,
  TFindAllRequestsFriendshipUseCase,
  TFindAllRequestsFriendshipUseCaseInput,
} from '../interfaces/use-case.interface';

export class FindAllRequestsFriendshipUseCase
  implements TFindAllRequestsFriendshipUseCase
{
  constructor(
    @Inject(FRIENDSHIP_REPOSITORY)
    private readonly friendshipRepository: TFriendshipRepository,
  ) {}

  async execute(
    input: TFindAllRequestsFriendshipUseCaseInput,
  ): Promise<TFindAllFriendshipUseCaseOutput> {
    const requests = await this.friendshipRepository.findAllRequests(input);

    if (requests.isLeft()) {
      throw requests.exception;
    }

    return requests.value;
  }
}
