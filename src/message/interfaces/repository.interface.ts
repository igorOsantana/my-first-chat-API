import { ApiException } from '../../shared/exception.shared';
import {
  TEither,
  TPaginationInput,
  TPaginationOutput,
} from '../../shared/interface.shared';
import { MessageEntity } from '../message.entity';

export const MESSAGE_REPOSITORY = Symbol('@MESSAGE_REPOSITORY');

export type TMessageRepository = {
  create(
    input: TMessageRepositoryCreateInput,
  ): Promise<TMessageRepositoryCreateOutput>;
  findAll(
    input: TMessageRepositoryFindAllInput,
  ): Promise<TMessageRepositoryFindAllOutput>;
};

// CREATE
export type TMessageRepositoryCreateInput = {
  content: string;
  ownerId: string;
  chatId: string;
};
export type TMessageRepositoryCreateOutput = TEither<
  ApiException,
  MessageEntity
>;

// FIND ALL
export type TMessageRepositoryFindAllInput = TPaginationInput & {
  chatId: string;
};
export type TMessageRepositoryFindAllOutput = TEither<
  ApiException,
  TPaginationOutput<MessageEntity>
>;
