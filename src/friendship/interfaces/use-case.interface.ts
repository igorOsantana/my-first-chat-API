import {
  TPaginationInput,
  TPaginationOutput,
  TUseCaseBase,
} from '../../shared/interface.shared';
import { FriendshipEntity } from '../friendship.entity';
import { TFriendshipDefaultInput } from './shared.interface';

export const FRIENDSHIP_USECASES = {
  ACCEPT: Symbol('@FRIENDSHIP_USECASE_ACCEPT'),
  CREATE: Symbol('@FRIENDSHIP_USECASE_CREATE'),
  DECLINE: Symbol('@FRIENDSHIP_USECASE_DECLINE'),
  FIND_ALL_MY_FRIENDS: Symbol('@FRIENDSHIP_USECASE_FIND_ALL_MY_FRIENDS'),
  FIND_ALL_REQUESTS: Symbol('@FRIENDSHIP_USECASE_FIND_ALL_REQUESTS'),
};

// ACCEPT
export type TAcceptFriendshipUseCase = TUseCaseBase<
  TFriendshipDefaultInput,
  Promise<void>
>;

// CREATE
export type TCreateFriendshipUseCase = TUseCaseBase<
  TFriendshipDefaultInput,
  Promise<FriendshipEntity>
>;

// DECLINE
export type TDeclineFriendshipUseCase = TUseCaseBase<
  TFriendshipDefaultInput,
  Promise<void>
>;

// FIND ALL MY FRIENDS
export type TFindAllMyFriendsFriendshipUseCase = TUseCaseBase<
  TFindAllMyFriendsFriendshipUseCaseInput,
  Promise<TFindAllFriendshipUseCaseOutput>
>;
export type TFindAllMyFriendsFriendshipUseCaseInput = TPaginationInput & {
  userId: string;
};

// FIND ALL REQUESTS
export type TFindAllRequestsFriendshipUseCase = TUseCaseBase<
  TFindAllRequestsFriendshipUseCaseInput,
  Promise<TFindAllFriendshipUseCaseOutput>
>;
export type TFindAllRequestsFriendshipUseCaseInput = TPaginationInput & {
  recipientId: string;
};

// FIND ALL
export type TFindAllFriendshipUseCaseOutput =
  TPaginationOutput<FriendshipEntity>;
