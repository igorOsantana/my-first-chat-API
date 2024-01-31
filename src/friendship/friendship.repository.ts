import { Injectable } from '@nestjs/common';
import { DatabaseServices } from '../shared/database/database.service';
import {
  Left,
  PaginationInputHelper,
  PaginationOutputHelper,
  Right,
} from '../shared/helpers.shared';
import { FriendshipRepositoryAdapter } from './friendship.adapter';
import { FriendshipExceptions } from './friendship.exception';
import {
  TFriendshipRepository,
  TFriendshipRepositoryFindAllMyFriendsInput,
  TFriendshipRepositoryFindAllOutput,
  TFriendshipRepositoryFindAllRequestsInput,
  TFriendshipRepositoryFindOneOutput,
  TFriendshipRepositoryUpdateInput,
} from './interfaces/repository.interface';
import { TFriendshipDefaultInput } from './interfaces/shared.interface';

@Injectable()
export class FriendshipRepository implements TFriendshipRepository {
  private readonly defaultRelations = {
    sender: true,
    recipient: true,
  };
  constructor(private readonly databaseService: DatabaseServices) {}

  async create(
    input: TFriendshipDefaultInput,
  ): Promise<TFriendshipRepositoryFindOneOutput> {
    const newFriendshipRequest = await this.databaseService.friendship.create({
      data: input,
      include: this.defaultRelations,
    });
    const output = FriendshipRepositoryAdapter.exec(newFriendshipRequest);
    return new Right(output);
  }

  async findAllMyFriends(
    input: TFriendshipRepositoryFindAllMyFriendsInput,
  ): Promise<TFriendshipRepositoryFindAllOutput> {
    const { skip, take } = PaginationInputHelper.exec(input);
    const where = {
      OR: [{ senderId: input.userId }, { recipientId: input.userId }],
      status: 'ACCEPTED' as const,
    };
    const [myFriends, total] = await Promise.all([
      this.databaseService.friendship.findMany({
        where,
        include: this.defaultRelations,
        skip,
        take,
      }),
      this.databaseService.friendship.count({ where }),
    ]);
    const output = PaginationOutputHelper.exec(
      FriendshipRepositoryAdapter.exec(myFriends),
      skip,
      total,
    );
    return new Right(output);
  }

  async findAllRequests(
    input: TFriendshipRepositoryFindAllRequestsInput,
  ): Promise<TFriendshipRepositoryFindAllOutput> {
    const { skip, take } = PaginationInputHelper.exec(input);
    const where = {
      recipientId: input.recipientId,
      status: 'PENDING' as const,
    };
    const [requests, total] = await Promise.all([
      this.databaseService.friendship.findMany({
        where,
        include: this.defaultRelations,
        skip,
        take,
      }),
      this.databaseService.friendship.count({ where }),
    ]);
    const output = PaginationOutputHelper.exec(
      FriendshipRepositoryAdapter.exec(requests),
      skip,
      total,
    );
    return new Right(output);
  }

  async findByIds(
    input: TFriendshipDefaultInput,
  ): Promise<TFriendshipRepositoryFindOneOutput> {
    const friendship = await this.databaseService.friendship.findUnique({
      where: {
        senderId_recipientId: {
          senderId: input.senderId,
          recipientId: input.recipientId,
        },
      },
      include: this.defaultRelations,
    });
    if (!friendship) {
      return new Left(FriendshipExceptions.NotFound);
    }
    const output = FriendshipRepositoryAdapter.exec(friendship);
    return new Right(output);
  }

  async update(
    input: TFriendshipRepositoryUpdateInput,
  ): Promise<TFriendshipRepositoryFindOneOutput> {
    const friendship = await this.databaseService.friendship.update({
      where: { senderId_recipientId: input.where },
      data: input.data,
      include: this.defaultRelations,
    });
    const output = FriendshipRepositoryAdapter.exec(friendship);
    return new Right(output);
  }
}
