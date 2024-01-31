import { Test } from '@nestjs/testing';
import { ApiException } from '../../shared/exception.shared';
import { Left, Right } from '../../shared/helpers.shared';
import {
  FRIENDSHIP_REPOSITORY,
  TFriendshipRepository,
} from '../interfaces/repository.interface';
import { TFindAllRequestsFriendshipUseCaseInput } from '../interfaces/use-case.interface';
import { FriendshipEntityMock } from '../mocks/entity.mock';
import {
  FriendshipRepositoryMock,
  getFriendshipRepositorySpies,
} from '../mocks/repository.mock';
import { FindAllRequestsFriendshipUseCase } from './find-all-requests.usecase';

describe('FindAllRequestsFriendshipUseCase', () => {
  let friendshipRepository: TFriendshipRepository;
  let sut: FindAllRequestsFriendshipUseCase;

  const anyException = new ApiException('any exception');

  function createPayload(): TFindAllRequestsFriendshipUseCaseInput {
    return {
      skip: 0,
      take: 5,
      recipientId: 'anyRecipientId',
    };
  }

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        FindAllRequestsFriendshipUseCase,
        { provide: FRIENDSHIP_REPOSITORY, useClass: FriendshipRepositoryMock },
      ],
    }).compile();

    friendshipRepository = moduleRef.get<FriendshipRepositoryMock>(
      FRIENDSHIP_REPOSITORY,
    );
    sut = moduleRef.get<FindAllRequestsFriendshipUseCase>(
      FindAllRequestsFriendshipUseCase,
    );
  });

  test('it should call the findAllRequests method of the FriendshipRepository with the payload as params', async () => {
    const { findAllRequestsSpy } =
      getFriendshipRepositorySpies(friendshipRepository);
    const payload = createPayload();

    await sut.execute(payload);

    expect(findAllRequestsSpy).toHaveBeenCalledTimes(1);
    expect(findAllRequestsSpy).toHaveBeenCalledWith(payload);
  });

  test('it should throw an exception if the findAllRequests method returns a Left value', () => {
    const { findAllRequestsSpy } =
      getFriendshipRepositorySpies(friendshipRepository);
    findAllRequestsSpy.mockResolvedValueOnce(new Left(anyException));
    const payload = createPayload();

    const result = sut.execute(payload);

    return expect(result).rejects.toThrowError(anyException);
  });

  test('it should return the friendship list', async () => {
    const friendship = {
      list: [FriendshipEntityMock.create(), FriendshipEntityMock.create()],
      meta: {
        skipped: 0,
        taken: 2,
        total: 5,
      },
    };
    const { findAllRequestsSpy } =
      getFriendshipRepositorySpies(friendshipRepository);
    findAllRequestsSpy.mockResolvedValueOnce(new Right(friendship));
    const payload = createPayload();

    const result = await sut.execute(payload);

    expect(result).toStrictEqual(friendship);
  });
});
