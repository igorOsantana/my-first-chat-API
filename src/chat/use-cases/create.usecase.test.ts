import { Test } from '@nestjs/testing';
import { ApiException } from '../../shared/exception.shared';
import { Left, Right } from '../../shared/helpers.shared';
import {
  TUserRepository,
  USER_REPOSITORY,
} from '../../user/interfaces/repository.interface';
import {
  UserRepositoryMock,
  getUserRepositorySpies,
} from '../../user/mocks/repository.mock';
import { ChatExceptions } from '../chat.exception';
import {
  CHAT_REPOSITORY,
  TChatRepository,
} from '../interfaces/repository.interface';
import { TCreateChatUseCaseInput } from '../interfaces/use-case.interface';
import { ChatEntityMock } from '../mocks/entity.mock';
import {
  ChatRepositoryMock,
  getChatRepositorySpies,
} from '../mocks/repository.mock';
import { CreateChatUseCase } from './create.usecase';

describe('CreateChatUseCase', () => {
  let chatRepository: TChatRepository;
  let userRepository: TUserRepository;
  let sut: CreateChatUseCase;

  const anyException = new ApiException('any exception');

  function createPayload(): TCreateChatUseCaseInput {
    return {
      msgContent: 'any message content',
      recipientId: 'anyRecipientId',
      senderId: 'anySenderId',
    };
  }

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateChatUseCase,
        { provide: CHAT_REPOSITORY, useClass: ChatRepositoryMock },
        { provide: USER_REPOSITORY, useClass: UserRepositoryMock },
      ],
    }).compile();

    chatRepository = moduleRef.get<ChatRepositoryMock>(CHAT_REPOSITORY);
    userRepository = moduleRef.get<UserRepositoryMock>(USER_REPOSITORY);
    sut = moduleRef.get<CreateChatUseCase>(CreateChatUseCase);
  });

  beforeEach(() => {
    const { findByParticipantsSpy } = getChatRepositorySpies(chatRepository);
    findByParticipantsSpy.mockResolvedValue(new Left(anyException));
  });

  test('it should call the findByParticipants method of the ChatRepository with the sent "senderId" and "recipientId" as params', async () => {
    const { findByParticipantsSpy } = getChatRepositorySpies(chatRepository);
    const payload = createPayload();

    await sut.execute(payload);

    expect(findByParticipantsSpy).toHaveBeenCalledTimes(1);
    expect(findByParticipantsSpy).toHaveBeenCalledWith(
      expect.arrayContaining([payload.recipientId, payload.senderId]),
    );
  });

  test('it should throw the AlreadyExists exception if the findByParticipants method returns a Right value', () => {
    const anyChat = ChatEntityMock.create();
    const { findByParticipantsSpy } = getChatRepositorySpies(chatRepository);
    findByParticipantsSpy.mockResolvedValueOnce(new Right(anyChat));
    const payload = createPayload();

    const result = sut.execute(payload);

    return expect(result).rejects.toThrowError(ChatExceptions.AlreadyExists);
  });

  test('it should call the findById method of the UserRepository with the sent "recipientId" as a param', async () => {
    const { findByIdSpy } = getUserRepositorySpies(userRepository);
    const payload = createPayload();

    await sut.execute(payload);

    expect(findByIdSpy).toHaveBeenCalledTimes(1);
    expect(findByIdSpy).toHaveBeenCalledWith(payload.recipientId);
  });

  test('it should throw the RecipientNotFound exception if the findById method returns a Left value', () => {
    const { findByIdSpy } = getUserRepositorySpies(userRepository);
    findByIdSpy.mockResolvedValueOnce(new Left(anyException));
    const payload = createPayload();

    const result = sut.execute(payload);

    return expect(result).rejects.toThrowError(
      ChatExceptions.RecipientNotFound,
    );
  });

  test('it should call the create method of the ChatRepository with the payload as params', async () => {
    const { createSpy } = getChatRepositorySpies(chatRepository);
    const payload = createPayload();

    await sut.execute(payload);

    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(createSpy).toHaveBeenCalledWith(payload);
  });

  test('it should throw an exception if the create method returns a Left value', () => {
    const { createSpy } = getChatRepositorySpies(chatRepository);
    createSpy.mockResolvedValueOnce(new Left(anyException));
    const payload = createPayload();

    const result = sut.execute(payload);

    return expect(result).rejects.toThrowError(anyException);
  });

  test('it should return the created chat', async () => {
    const createdChat = ChatEntityMock.create();
    const { createSpy } = getChatRepositorySpies(chatRepository);
    createSpy.mockResolvedValueOnce(new Right(createdChat));
    const payload = createPayload();

    const result = await sut.execute(payload);

    expect(result).toStrictEqual(createdChat);
  });
});
