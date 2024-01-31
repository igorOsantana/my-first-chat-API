import { Test } from '@nestjs/testing';
import { ApiException } from '../../shared/exception.shared';
import { Left, Right } from '../../shared/helpers.shared';
import {
  FRIENDSHIP_REPOSITORY,
  TFriendshipRepository,
} from '../interfaces/repository.interface';
import { TFindAllMyFriendsFriendshipUseCaseInput } from '../interfaces/use-case.interface';
import { FriendshipEntityMock } from '../mocks/entity.mock';
import {
  FriendshipRepositoryMock,
  getFriendshipRepositorySpies,
} from '../mocks/repository.mock';
import { FindAllMyFriendsFriendshipUseCase } from './find-all-my-friends.usecase';

describe('FindAllMyFriendsFriendshipUseCase', () => {
  let friendshipRepository: TFriendshipRepository;
  let sut: FindAllMyFriendsFriendshipUseCase;

  const anyException = new ApiException('any exception');

  function createPayload(): TFindAllMyFriendsFriendshipUseCaseInput {
    return {
      skip: 0,
      take: 5,
      userId: 'anyUserId',
    };
  }

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        FindAllMyFriendsFriendshipUseCase,
        { provide: FRIENDSHIP_REPOSITORY, useClass: FriendshipRepositoryMock },
      ],
    }).compile();

    friendshipRepository = moduleRef.get<FriendshipRepositoryMock>(
      FRIENDSHIP_REPOSITORY,
    );
    sut = moduleRef.get<FindAllMyFriendsFriendshipUseCase>(
      FindAllMyFriendsFriendshipUseCase,
    );
  });

  test('it should call the findAllMyFriends method of the FriendshipRepository with the payload as params', async () => {
    const { findAllMyFriendsSpy } =
      getFriendshipRepositorySpies(friendshipRepository);
    const payload = createPayload();

    await sut.execute(payload);

    expect(findAllMyFriendsSpy).toHaveBeenCalledTimes(1);
    expect(findAllMyFriendsSpy).toHaveBeenCalledWith(payload);
  });

  test('it should throw an exception if the findAllMyFriends method returns a Left value', () => {
    const { findAllMyFriendsSpy } =
      getFriendshipRepositorySpies(friendshipRepository);
    findAllMyFriendsSpy.mockResolvedValueOnce(new Left(anyException));
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
    const { findAllMyFriendsSpy } =
      getFriendshipRepositorySpies(friendshipRepository);
    findAllMyFriendsSpy.mockResolvedValueOnce(new Right(friendship));
    const payload = createPayload();

    const result = await sut.execute(payload);

    expect(result).toStrictEqual(friendship);
  });
});
