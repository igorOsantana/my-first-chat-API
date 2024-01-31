import { Test } from '@nestjs/testing';
import { ApiException } from '../../shared/exception.shared';
import { Left } from '../../shared/helpers.shared';
import { FriendshipStatus } from '../friendship.entity';
import {
  FRIENDSHIP_REPOSITORY,
  TFriendshipRepository,
} from '../interfaces/repository.interface';
import { TFriendshipDefaultInput } from '../interfaces/shared.interface';
import {
  FriendshipRepositoryMock,
  getFriendshipRepositorySpies,
} from '../mocks/repository.mock';
import { AcceptFriendshipUseCase } from './accept.usecase';

describe('AcceptFriendshipUseCase', () => {
  let friendshipRepository: TFriendshipRepository;
  let sut: AcceptFriendshipUseCase;

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
        AcceptFriendshipUseCase,
        { provide: FRIENDSHIP_REPOSITORY, useClass: FriendshipRepositoryMock },
      ],
    }).compile();

    friendshipRepository = moduleRef.get<FriendshipRepositoryMock>(
      FRIENDSHIP_REPOSITORY,
    );
    sut = moduleRef.get<AcceptFriendshipUseCase>(AcceptFriendshipUseCase);
  });

  test('it should call the findByIds method of the FriendshipRepository with the payload as params', async () => {
    const { findByIdsSpy } = getFriendshipRepositorySpies(friendshipRepository);
    const payload = createPayload();

    await sut.execute(payload);

    expect(findByIdsSpy).toHaveBeenCalledTimes(1);
    expect(findByIdsSpy).toHaveBeenCalledWith(payload);
  });

  test('it should throw an exception if the findByIds method returns a Left value', () => {
    const { findByIdsSpy } = getFriendshipRepositorySpies(friendshipRepository);
    findByIdsSpy.mockResolvedValueOnce(new Left(anyException));
    const payload = createPayload();

    const result = sut.execute(payload);

    return expect(result).rejects.toThrowError(anyException);
  });

  test('it should call the update method of the FriendshipRepository filtering by the payload and with the "status" as "ACCEPTED"', async () => {
    const { updateSpy } = getFriendshipRepositorySpies(friendshipRepository);
    const payload = createPayload();

    await sut.execute(payload);

    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(updateSpy).toHaveBeenCalledWith({
      where: payload,
      data: { status: FriendshipStatus.ACCEPTED },
    });
  });

  test('it should throw an exception if the update method returns a Left value', () => {
    const { updateSpy } = getFriendshipRepositorySpies(friendshipRepository);
    updateSpy.mockResolvedValueOnce(new Left(anyException));
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
