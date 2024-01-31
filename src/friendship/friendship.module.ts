import { Module, Provider } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/database/database.module';
import { FriendshipControllers } from './friendship.controller';
import { FriendshipRepository } from './friendship.repository';
import { FRIENDSHIP_REPOSITORY } from './interfaces/repository.interface';
import { FRIENDSHIP_USECASES } from './interfaces/use-case.interface';
import { AcceptFriendshipUseCase } from './use-cases/accept.usecase';
import { CreateFriendshipUseCase } from './use-cases/create.usecase';
import { DeclineFriendshipUseCase } from './use-cases/decline.usecase';
import { FindAllMyFriendsFriendshipUseCase } from './use-cases/find-all-my-friends.usecase';
import { FindAllRequestsFriendshipUseCase } from './use-cases/find-all-requests.usecase';

const providers: Provider[] = [
  {
    useClass: AcceptFriendshipUseCase,
    provide: FRIENDSHIP_USECASES.ACCEPT,
  },
  {
    useClass: CreateFriendshipUseCase,
    provide: FRIENDSHIP_USECASES.CREATE,
  },
  {
    useClass: DeclineFriendshipUseCase,
    provide: FRIENDSHIP_USECASES.DECLINE,
  },
  {
    useClass: FindAllMyFriendsFriendshipUseCase,
    provide: FRIENDSHIP_USECASES.FIND_ALL_MY_FRIENDS,
  },
  {
    useClass: FindAllRequestsFriendshipUseCase,
    provide: FRIENDSHIP_USECASES.FIND_ALL_REQUESTS,
  },
  {
    useClass: FriendshipRepository,
    provide: FRIENDSHIP_REPOSITORY,
  },
];

@Module({
  imports: [DatabaseModule],
  controllers: [FriendshipControllers],
  providers: [...providers],
  exports: [...providers],
})
export class FriendshipModule {}
