import { Test } from '@nestjs/testing';
import { ApiException } from '../../shared/exception.shared';
import { Left, Right } from '../../shared/helpers.shared';
import { ChatExceptions } from '../chat.exception';
import {
  CHAT_REPOSITORY,
  TChatRepository,
} from '../interfaces/repository.interface';
import { TMarkAsReadChatUseCaseInput } from '../interfaces/use-case.interface';
import { ChatEntityMock } from '../mocks/entity.mock';
import {
  ChatRepositoryMock,
  getChatRepositorySpies,
} from '../mocks/repository.mock';
import { MarkAsReadChatUseCase } from './mark-as-read.usecase';

describe('MarkAsReadChatUseCase', () => {
  let chatRepository: TChatRepository;
  let sut: MarkAsReadChatUseCase;

  const anyException = new ApiException('any exception');

  function createPayload(): TMarkAsReadChatUseCaseInput {
    return { id: 'anyChatId', userId: 'anyUserId' };
  }

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        MarkAsReadChatUseCase,
        { provide: CHAT_REPOSITORY, useClass: ChatRepositoryMock },
      ],
    }).compile();

    chatRepository = moduleRef.get<ChatRepositoryMock>(CHAT_REPOSITORY);
    sut = moduleRef.get<MarkAsReadChatUseCase>(MarkAsReadChatUseCase);
  });

  test('it should call the findById method of the ChatRepository with the sent "ID" as a param', async () => {
    const { findByIdSpy } = getChatRepositorySpies(chatRepository);
    const payload = createPayload();

    await sut.execute(payload);

    expect(findByIdSpy).toHaveBeenCalledTimes(1);
    expect(findByIdSpy).toHaveBeenCalledWith(payload.id);
  });

  test('it should throw an exception if the findById method returns a Left value', () => {
    const { findByIdSpy } = getChatRepositorySpies(chatRepository);
    findByIdSpy.mockResolvedValueOnce(new Left(anyException));
    const payload = createPayload();

    const result = sut.execute(payload);

    return expect(result).rejects.toThrowError(anyException);
  });

  test('it should throw the NotFound exception if the isParticipant method of ChatEntity returns false', () => {
    const chat = ChatEntityMock.create();
    chat.isParticipant = () => false;
    const { findByIdSpy } = getChatRepositorySpies(chatRepository);
    findByIdSpy.mockResolvedValueOnce(new Right(chat));
    const payload = createPayload();

    const result = sut.execute(payload);

    expect(chat.isParticipant(payload.userId)).toBe(false);
    return expect(result).rejects.toThrowError(ChatExceptions.NotFound);
  });

  test('it should call the markAsRead method of the ChatRepository with the payload as param', async () => {
    const { markAsReadSpy } = getChatRepositorySpies(chatRepository);
    const payload = createPayload();

    await sut.execute(payload);

    expect(markAsReadSpy).toHaveBeenCalledTimes(1);
    expect(markAsReadSpy).toHaveBeenCalledWith(payload);
  });

  test('it should throw an exception if the markAsRead method returns a Left value', () => {
    const { markAsReadSpy } = getChatRepositorySpies(chatRepository);
    markAsReadSpy.mockResolvedValueOnce(new Left(anyException));
    const payload = createPayload();

    const result = sut.execute(payload);

    return expect(result).rejects.toThrowError(anyException);
  });

  test('it should not return anything', async () => {
    const payload = createPayload();

    const result = await sut.execute(payload);

    expect(result).toBeUndefined();
  });
});
