import { TPaginationOutput, TUseCaseBase } from '../../shared/interface.shared';
import { MessageEntity } from '../message.entity';
import {
  TMessageRepositoryCreateInput,
  TMessageRepositoryFindAllInput,
} from './repository.interface';

export const MESSAGE_USE_CASES = {
  FIND_ALL: Symbol('@MESSAGE_USE_CASES_FIND_ALL'),
  SEND: Symbol('@MESSAGE_USE_CASES_SEND'),
};

// FIND ALL
export type TMessageUseCaseFindAll = TUseCaseBase<
  TMessageUseCaseFindAllInput,
  Promise<TMessageUseCaseFindAllOutput>
>;
export type TMessageUseCaseFindAllInput = TMessageRepositoryFindAllInput;
export type TMessageUseCaseFindAllOutput = TPaginationOutput<MessageEntity>;

// SEND
export type TMessageUseCaseSend = TUseCaseBase<
  TMessageUseCaseSendInput,
  Promise<TMessageUseCaseSendOutput>
>;
export type TMessageUseCaseSendInput = TMessageRepositoryCreateInput;
export type TMessageUseCaseSendOutput = MessageEntity;
