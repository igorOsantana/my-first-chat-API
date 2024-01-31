import { Test } from '@nestjs/testing';
import { ApiException } from '../../shared/exception.shared';
import { Left, Right } from '../../shared/helpers.shared';
import {
  CHAT_REPOSITORY,
  TChatRepository,
} from '../interfaces/repository.interface';
import { ChatEntityMock } from '../mocks/entity.mock';
import {
  ChatRepositoryMock,
  getChatRepositorySpies,
} from '../mocks/repository.mock';
import { FindByIdChatUseCase } from './find-by-id.usecase';

describe('FindByIdChatUseCase', () => {
  let chatRepository: TChatRepository;
  let sut: FindByIdChatUseCase;

  const anyException = new ApiException('any exception');

  function createPayload() {
    return 'anyChatId';
  }

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        FindByIdChatUseCase,
        { provide: CHAT_REPOSITORY, useClass: ChatRepositoryMock },
      ],
    }).compile();

    chatRepository = moduleRef.get<ChatRepositoryMock>(CHAT_REPOSITORY);
    sut = moduleRef.get<FindByIdChatUseCase>(FindByIdChatUseCase);
  });

  test('it should call the findById method of the ChatRepository with the sent "ID" as a param', async () => {
    const { findByIdSpy } = getChatRepositorySpies(chatRepository);
    const payload = createPayload();

    await sut.execute(payload);

    expect(findByIdSpy).toHaveBeenCalledTimes(1);
    expect(findByIdSpy).toHaveBeenCalledWith(payload);
  });

  test('it should throw an exception if the findById method returns a Left value', () => {
    const { findByIdSpy } = getChatRepositorySpies(chatRepository);
    findByIdSpy.mockResolvedValueOnce(new Left(anyException));
    const payload = createPayload();

    const result = sut.execute(payload);

    return expect(result).rejects.toThrowError(anyException);
  });

  test('it should return the found chat', async () => {
    const foundChat = ChatEntityMock.create();
    const { findByIdSpy } = getChatRepositorySpies(chatRepository);
    findByIdSpy.mockResolvedValueOnce(new Right(foundChat));
    const payload = createPayload();

    const result = await sut.execute(payload);

    expect(result).toStrictEqual(foundChat);
  });
});
