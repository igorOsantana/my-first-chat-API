import { Test } from '@nestjs/testing';
import { ApiException } from '../../shared/exception.shared';
import { Left, Right } from '../../shared/helpers.shared';
import {
  MESSAGE_REPOSITORY,
  TMessageRepository,
} from '../interfaces/repository.interface';
import { TMessageUseCaseFindAllInput } from '../interfaces/use-case.interface';
import { MessageEntityMock } from '../mocks/entity.mock';
import {
  MessageRepositoryMock,
  getMessageRepositorySpies,
} from '../mocks/repository.mock';
import { MessageUseCaseFindAll } from './find-all.usecase';

describe('MessageUseCaseFindAll', () => {
  let messageRepository: TMessageRepository;
  let sut: MessageUseCaseFindAll;

  const anyException = new ApiException('any exception');

  function createPayload(): TMessageUseCaseFindAllInput {
    return {
      skip: 0,
      take: 5,
      chatId: 'anyChatId',
    };
  }

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        MessageUseCaseFindAll,
        { provide: MESSAGE_REPOSITORY, useClass: MessageRepositoryMock },
      ],
    }).compile();

    messageRepository =
      moduleRef.get<MessageRepositoryMock>(MESSAGE_REPOSITORY);
    sut = moduleRef.get<MessageUseCaseFindAll>(MessageUseCaseFindAll);
  });

  test('it should call the findAll method of the MessageRepository with the payload as params', async () => {
    const { findAllSpy } = getMessageRepositorySpies(messageRepository);
    const payload = createPayload();

    await sut.execute(payload);

    expect(findAllSpy).toHaveBeenCalledTimes(1);
    expect(findAllSpy).toHaveBeenCalledWith(payload);
  });

  test('it should throw an exception if the findAll method returns a Left value', () => {
    const { findAllSpy } = getMessageRepositorySpies(messageRepository);
    findAllSpy.mockResolvedValueOnce(new Left(anyException));
    const payload = createPayload();

    const result = sut.execute(payload);

    return expect(result).rejects.toThrowError(anyException);
  });

  test('it should return the message list', async () => {
    const messages = {
      list: [MessageEntityMock.create(), MessageEntityMock.create()],
      meta: {
        skipped: 0,
        taken: 2,
        total: 5,
      },
    };
    const { findAllSpy } = getMessageRepositorySpies(messageRepository);
    findAllSpy.mockResolvedValueOnce(new Right(messages));
    const payload = createPayload();

    const result = await sut.execute(payload);

    expect(result).toStrictEqual(messages);
  });
});
