import { Test } from '@nestjs/testing';
import { ApiException } from '../../shared/exception.shared';
import { Left, Right } from '../../shared/helpers.shared';
import { FriendshipExceptions } from '../friendship.exception';
import {
  FRIENDSHIP_REPOSITORY,
  TFriendshipRepository,
} from '../interfaces/repository.interface';
import { TFriendshipDefaultInput } from '../interfaces/shared.interface';
import { FriendshipEntityMock } from '../mocks/entity.mock';
import {
  FriendshipRepositoryMock,
  getFriendshipRepositorySpies,
} from '../mocks/repository.mock';
import { CreateFriendshipUseCase } from './create.usecase';

describe('CreateFriendshipUseCase', () => {
  let friendshipRepository: TFriendshipRepository;
  let sut: CreateFriendshipUseCase;

  const anyException = new ApiException('any exception');

  function createPayload(): TFriendshipDefaultInput {
    return {
      recipientId: 'anyRecipientId',
      senderId: 'anySenderId',
    };
  }

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateFriendshipUseCase,
        { provide: FRIENDSHIP_REPOSITORY, useClass: FriendshipRepositoryMock },
      ],
    }).compile();

    friendshipRepository = moduleRef.get<FriendshipRepositoryMock>(
      FRIENDSHIP_REPOSITORY,
    );
    sut = moduleRef.get<CreateFriendshipUseCase>(CreateFriendshipUseCase);
  });

  beforeEach(() => {
    const { findByIdsSpy } = getFriendshipRepositorySpies(friendshipRepository);
    findByIdsSpy.mockResolvedValue(new Left(anyException));
  });

  test('it should call the findByIds method of the FriendshipRepository with the payload as params', async () => {
    const { findByIdsSpy } = getFriendshipRepositorySpies(friendshipRepository);
    const payload = createPayload();

    await sut.execute(payload);

    expect(findByIdsSpy).toHaveBeenCalledTimes(1);
    expect(findByIdsSpy).toHaveBeenCalledWith(payload);
  });

  test('it should throw the AlreadyExists exception if the findByIds method returns a Right value', () => {
    const anyFriendship = FriendshipEntityMock.create();
    const { findByIdsSpy } = getFriendshipRepositorySpies(friendshipRepository);
    findByIdsSpy.mockResolvedValueOnce(new Right(anyFriendship));
    const payload = createPayload();

    const result = sut.execute(payload);

    return expect(result).rejects.toThrowError(
      FriendshipExceptions.AlreadyExists,
    );
  });

  test('it should call the create method of the FriendshipRepository with the payload as params', async () => {
    const { createSpy } = getFriendshipRepositorySpies(friendshipRepository);
    const payload = createPayload();

    await sut.execute(payload);

    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(createSpy).toHaveBeenCalledWith(payload);
  });

  test('it should throw an exception if the create method returns a Left value', () => {
    const { createSpy } = getFriendshipRepositorySpies(friendshipRepository);
    createSpy.mockResolvedValueOnce(new Left(anyException));
    const payload = createPayload();

    const result = sut.execute(payload);

    return expect(result).rejects.toThrowError(anyException);
  });

  test('it should return the created friendship', async () => {
    const createdFriendship = FriendshipEntityMock.create();
    const { createSpy } = getFriendshipRepositorySpies(friendshipRepository);
    createSpy.mockResolvedValueOnce(new Right(createdFriendship));
    const payload = createPayload();

    const result = await sut.execute(payload);

    expect(result).toStrictEqual(createdFriendship);
  });
});
