/* eslint-disable @typescript-eslint/no-unused-vars */
import { Right } from '../../shared/helpers.shared';
import {
  TFriendshipRepository,
  TFriendshipRepositoryFindAllMyFriendsInput,
  TFriendshipRepositoryFindAllOutput,
  TFriendshipRepositoryFindAllRequestsInput,
  TFriendshipRepositoryFindOneOutput,
  TFriendshipRepositoryUpdateInput,
} from '../interfaces/repository.interface';
import { TFriendshipDefaultInput } from '../interfaces/shared.interface';
import { FriendshipEntityMock } from './entity.mock';

export class FriendshipRepositoryMock implements TFriendshipRepository {
  create(
    input: TFriendshipDefaultInput,
  ): Promise<TFriendshipRepositoryFindOneOutput> {
    return Promise.resolve(new Right(FriendshipEntityMock.create(input)));
  }

  async findAllMyFriends(
    input: TFriendshipRepositoryFindAllMyFriendsInput,
  ): Promise<TFriendshipRepositoryFindAllOutput> {
    const list = [
      FriendshipEntityMock.create(),
      FriendshipEntityMock.create(),
      FriendshipEntityMock.create(),
    ];
    const meta = {
      skipped: input.skip || 0,
      taken: list.length,
      total: list.length,
    };
    return Promise.resolve(new Right({ list, meta }));
  }

  async findAllRequests(
    input: TFriendshipRepositoryFindAllRequestsInput,
  ): Promise<TFriendshipRepositoryFindAllOutput> {
    const list = [
      FriendshipEntityMock.create(input),
      FriendshipEntityMock.create(input),
      FriendshipEntityMock.create(input),
    ];
    const meta = {
      skipped: input.skip || 0,
      taken: list.length,
      total: list.length,
    };
    return Promise.resolve(new Right({ list, meta }));
  }

  findByIds(
    input: TFriendshipDefaultInput,
  ): Promise<TFriendshipRepositoryFindOneOutput> {
    return Promise.resolve(new Right(FriendshipEntityMock.create(input)));
  }

  async update(
    input: TFriendshipRepositoryUpdateInput,
  ): Promise<TFriendshipRepositoryFindOneOutput> {
    return Promise.resolve(
      new Right(
        FriendshipEntityMock.create({
          recipientId: input.where.recipientId,
          senderId: input.where.senderId,
          status: input.data.status,
        }),
      ),
    );
  }
}

export function getFriendshipRepositorySpies(
  friendshipRepository: FriendshipRepositoryMock,
) {
  return {
    createSpy: jest.spyOn(friendshipRepository, 'create'),
    findAllMyFriendsSpy: jest.spyOn(friendshipRepository, 'findAllMyFriends'),
    findAllRequestsSpy: jest.spyOn(friendshipRepository, 'findAllRequests'),
    findByIdsSpy: jest.spyOn(friendshipRepository, 'findByIds'),
    updateSpy: jest.spyOn(friendshipRepository, 'update'),
  };
}
