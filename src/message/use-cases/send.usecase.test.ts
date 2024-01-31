import { Test } from '@nestjs/testing';
import {
  CHAT_REPOSITORY,
  TChatRepository,
} from '../../chat/interfaces/repository.interface';
import { ChatModuleMock } from '../../chat/mocks/module.mock';
import {
  ChatRepositoryMock,
  getChatRepositorySpies,
} from '../../chat/mocks/repository.mock';
import { ApiException } from '../../shared/exception.shared';
import { Left, Right } from '../../shared/helpers.shared';
import {
  MESSAGE_REPOSITORY,
  TMessageRepository,
} from '../interfaces/repository.interface';
import { TMessageUseCaseSendInput } from '../interfaces/use-case.interface';
import { MessageEntityMock } from '../mocks/entity.mock';
import { MessageModuleMock } from '../mocks/module.mock';
import {
  MessageRepositoryMock,
  getMessageRepositorySpies,
} from '../mocks/repository.mock';
import { MessageUseCaseSend } from './send.usecase';

describe('CreateFriendshipUseCase', () => {
  let messageRepository: TMessageRepository;
  let chatRepository: TChatRepository;
  let sut: MessageUseCaseSend;

  const anyException = new ApiException('any exception');

  function createPayload(): TMessageUseCaseSendInput {
    return {
      chatId: 'anyChatId',
      content: 'any message',
      ownerId: 'anyOwnerId',
    };
  }

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ChatModuleMock, MessageModuleMock],
      providers: [MessageUseCaseSend],
    }).compile();

    messageRepository =
      moduleRef.get<MessageRepositoryMock>(MESSAGE_REPOSITORY);
    chatRepository = moduleRef.get<ChatRepositoryMock>(CHAT_REPOSITORY);
    sut = moduleRef.get<MessageUseCaseSend>(MessageUseCaseSend);
  });

  test('it should call the findById method of the ChatRepository with the sent "chatId" as param', async () => {
    const { findByIdSpy } = getChatRepositorySpies(chatRepository);
    const payload = createPayload();

    await sut.execute(payload);

    expect(findByIdSpy).toHaveBeenCalledTimes(1);
    expect(findByIdSpy).toHaveBeenCalledWith(payload.chatId);
  });

  test('it should throw an exception if the findById method of the ChatRepository returns a Left value', () => {
    const { findByIdSpy } = getChatRepositorySpies(chatRepository);
    findByIdSpy.mockResolvedValueOnce(new Left(anyException));
    const payload = createPayload();

    const result = sut.execute(payload);

    return expect(result).rejects.toThrowError(anyException);
  });

  test('it should call the create method of the MessageRepository with the payload as params', async () => {
    const { createSpy } = getMessageRepositorySpies(messageRepository);
    const payload = createPayload();

    await sut.execute(payload);

    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(createSpy).toHaveBeenCalledWith(payload);
  });

  test('it should throw an exception if the create method returns a Left value', () => {
    const { createSpy } = getMessageRepositorySpies(messageRepository);
    createSpy.mockResolvedValueOnce(new Left(anyException));
    const payload = createPayload();

    const result = sut.execute(payload);

    return expect(result).rejects.toThrowError(anyException);
  });

  test('it should return the created message', async () => {
    const createdMessage = MessageEntityMock.create();
    const { createSpy } = getMessageRepositorySpies(messageRepository);
    createSpy.mockResolvedValueOnce(new Right(createdMessage));
    const payload = createPayload();

    const result = await sut.execute(payload);

    expect(result).toStrictEqual(createdMessage);
  });
});
