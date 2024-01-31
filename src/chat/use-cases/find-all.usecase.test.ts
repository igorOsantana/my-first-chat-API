import { Test } from '@nestjs/testing';
import { ApiException } from '../../shared/exception.shared';
import { Left, Right } from '../../shared/helpers.shared';
import {
  CHAT_REPOSITORY,
  TChatRepository,
} from '../interfaces/repository.interface';
import { TFindAllChatUseCaseInput } from '../interfaces/use-case.interface';
import { ChatEntityMock } from '../mocks/entity.mock';
import {
  ChatRepositoryMock,
  getChatRepositorySpies,
} from '../mocks/repository.mock';
import { FindAllChatUseCase } from './find-all.usecase';

describe('FindAllChatUseCase', () => {
  let chatRepository: TChatRepository;
  let sut: FindAllChatUseCase;

  const anyException = new ApiException('any exception');

  function createPayload(): TFindAllChatUseCaseInput {
    return {
      userId: 'anyUserId',
      skip: 0,
      take: 10,
    };
  }

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        FindAllChatUseCase,
        { provide: CHAT_REPOSITORY, useClass: ChatRepositoryMock },
      ],
    }).compile();

    chatRepository = moduleRef.get<ChatRepositoryMock>(CHAT_REPOSITORY);
    sut = moduleRef.get<FindAllChatUseCase>(FindAllChatUseCase);
  });

  test('it should call the findAll method of the ChatRepository with the payload as params', async () => {
    const { findAllSpy } = getChatRepositorySpies(chatRepository);
    const payload = createPayload();

    await sut.execute(payload);

    expect(findAllSpy).toHaveBeenCalledTimes(1);
    expect(findAllSpy).toHaveBeenCalledWith(payload);
  });

  test('it should throw an exception if the findAll method returns a Left value', () => {
    const { findAllSpy } = getChatRepositorySpies(chatRepository);
    findAllSpy.mockResolvedValueOnce(new Left(anyException));
    const payload = createPayload();

    const result = sut.execute(payload);

    return expect(result).rejects.toThrowError(anyException);
  });

  test('it should return the chat list', async () => {
    const chatList = {
      list: [ChatEntityMock.create(), ChatEntityMock.create()],
      meta: {
        skipped: 0,
        taken: 2,
        total: 5,
      },
    };
    const { findAllSpy } = getChatRepositorySpies(chatRepository);
    findAllSpy.mockResolvedValueOnce(new Right(chatList));
    const payload = createPayload();

    const result = await sut.execute(payload);

    expect(result).toStrictEqual(chatList);
  });
});
