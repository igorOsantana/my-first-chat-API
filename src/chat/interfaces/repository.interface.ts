import { ApiException } from '../../shared/exception.shared';
import {
  TEither,
  TPaginationInput,
  TPaginationOutput,
} from '../../shared/interface.shared';
import { ChatEntity } from '../chat.entity';

export const CHAT_REPOSITORY = Symbol('@CHAT_REPOSITORY');

export type TChatRepository = {
  create(
    input: TChatRepositoryCreateInput,
  ): Promise<TChatRepositoryFindOneOutput>;
  findAll(
    input: TChatRepositoryFindAllInput,
  ): Promise<TChatRepositoryFindAllOutput>;
  findById(id: string): Promise<TChatRepositoryFindOneOutput>;
  findByParticipants(ids: string[]): Promise<TChatRepositoryFindOneOutput>;
  markAsRead(
    input: TChatRepositoryMarkAsReadInput,
  ): Promise<TChatRepositoryMarkAsReadOutput>;
};

// CREATE
export type TChatRepositoryCreateInput = {
  msgContent: string;
  senderId: string;
  recipientId: string;
};

// FIND ALL
export type TChatRepositoryFindAllInput = TPaginationInput & {
  userId?: string;
};
export type TChatRepositoryFindAllOutput = TEither<
  ApiException,
  TPaginationOutput<ChatEntity>
>;

// FIND ONE
export type TChatRepositoryFindOneOutput = TEither<ApiException, ChatEntity>;

// MARK AS READ
export type TChatRepositoryMarkAsReadInput = {
  id: string;
  userId: string;
};
export type TChatRepositoryMarkAsReadOutput = TEither<ApiException, void>;
