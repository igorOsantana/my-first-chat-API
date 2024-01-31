import {
  TPaginationInput,
  TPaginationOutput,
  TUseCaseBase,
} from '../../shared/interface.shared';
import { ChatEntity } from '../chat.entity';

export const CHAT_USECASES = {
  CREATE: Symbol('@CHAT_USECASE_CREATE'),
  FIND_BY_ID: Symbol('@CHAT_USECASE_FIND_BY_ID'),
  FIND_ALL: Symbol('@CHAT_USECASE_FIND_ALL'),
  MARK_AS_READ: Symbol('@CHAT_USECASE_MARK_AS_READ'),
};

// CREATE
export type TCreateChatUseCase = TUseCaseBase<
  TCreateChatUseCaseInput,
  Promise<TCreateChatUseCaseOutput>
>;
export type TCreateChatUseCaseInput = {
  msgContent: string;
  senderId: string;
  recipientId: string;
};
export type TCreateChatUseCaseOutput = ChatEntity;

// FIND ALL
export type TFindAllChatUseCase = TUseCaseBase<
  TFindAllChatUseCaseInput,
  Promise<TPaginationOutput<ChatEntity>>
>;
export type TFindAllChatUseCaseInput = TPaginationInput & {
  userId?: string;
};

// FIND BY ID
export type TFindByIdChatUseCase = TUseCaseBase<
  string,
  Promise<TFindByIdChatUseCaseOutput>
>;
export type TFindByIdChatUseCaseOutput = ChatEntity;

// MARK AS READ
export type TMarkAsReadChatUseCase = TUseCaseBase<
  TMarkAsReadChatUseCaseInput,
  Promise<void>
>;
export type TMarkAsReadChatUseCaseInput = {
  id: string;
  userId: string;
};
