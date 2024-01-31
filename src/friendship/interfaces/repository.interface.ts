import { ApiException } from '../../shared/exception.shared';
import {
  TEither,
  TPaginationInput,
  TPaginationOutput,
} from '../../shared/interface.shared';
import { FriendshipEntity, FriendshipStatus } from '../friendship.entity';
import { TFriendshipDefaultInput } from './shared.interface';

export const FRIENDSHIP_REPOSITORY = Symbol('@FRIENDSHIP_REPOSITORY');

export type TFriendshipRepository = {
  create(
    input: TFriendshipDefaultInput,
  ): Promise<TFriendshipRepositoryFindOneOutput>;
  findAllMyFriends(
    input: TFriendshipRepositoryFindAllMyFriendsInput,
  ): Promise<TFriendshipRepositoryFindAllOutput>;
  findAllRequests(
    input: TFriendshipRepositoryFindAllRequestsInput,
  ): Promise<TFriendshipRepositoryFindAllOutput>;
  findByIds(
    input: TFriendshipDefaultInput,
  ): Promise<TFriendshipRepositoryFindOneOutput>;
  update(
    input: TFriendshipRepositoryUpdateInput,
  ): Promise<TFriendshipRepositoryFindOneOutput>;
};

// UPDATE
export type TFriendshipRepositoryUpdateInput = {
  where: TFriendshipDefaultInput;
  data: {
    status: FriendshipStatus;
  };
};

// FIND ALL MY FRIENDS
export type TFriendshipRepositoryFindAllMyFriendsInput = TPaginationInput & {
  userId: string;
};

// FIND ALL REQUESTS
export type TFriendshipRepositoryFindAllRequestsInput = TPaginationInput & {
  recipientId: string;
};

// FIND ONE
export type TFriendshipRepositoryFindOneOutput = TEither<
  ApiException,
  FriendshipEntity
>;
// FIND ALL
export type TFriendshipRepositoryFindAllOutput = TEither<
  ApiException,
  TPaginationOutput<FriendshipEntity>
>;
