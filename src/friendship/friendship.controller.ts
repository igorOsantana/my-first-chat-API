import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { RequestUser, TRequestUser } from 'src/shared/decorator.shared';
import {
  AcceptResponseDoc,
  CreateResponseDoc,
  DeclineResponseDoc,
  FriendshipControllersDoc,
  MyFriendsResponseDoc,
  RequestsResponseDoc,
} from './friendship.doc';
import {
  FriendshipPresenter,
  MyFriendsFriendshipPresenter,
  RequestsFriendshipPresenter,
} from './friendship.presenter';
import {
  FRIENDSHIP_USECASES,
  TAcceptFriendshipUseCase,
  TCreateFriendshipUseCase,
  TDeclineFriendshipUseCase,
  TFindAllMyFriendsFriendshipUseCase,
  TFindAllRequestsFriendshipUseCase,
} from './interfaces/use-case.interface';

@Controller('friendships')
@FriendshipControllersDoc()
export class FriendshipControllers {
  constructor(
    @Inject(FRIENDSHIP_USECASES.ACCEPT)
    private readonly acceptFriendshipUseCase: TAcceptFriendshipUseCase,
    @Inject(FRIENDSHIP_USECASES.CREATE)
    private readonly createFriendshipUseCase: TCreateFriendshipUseCase,
    @Inject(FRIENDSHIP_USECASES.DECLINE)
    private readonly declineFriendshipUseCase: TDeclineFriendshipUseCase,
    @Inject(FRIENDSHIP_USECASES.FIND_ALL_MY_FRIENDS)
    private readonly findAllMyFriendsFriendshipUseCase: TFindAllMyFriendsFriendshipUseCase,
    @Inject(FRIENDSHIP_USECASES.FIND_ALL_REQUESTS)
    private readonly findAllRequestsFriendshipUseCase: TFindAllRequestsFriendshipUseCase,
  ) {}

  @Patch('/accept/:senderId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @AcceptResponseDoc()
  async accept(
    @Param('senderId') senderId: string,
    @RequestUser() reqUser: TRequestUser,
  ) {
    await this.acceptFriendshipUseCase.execute({
      senderId,
      recipientId: reqUser.id,
    });
  }

  @Post('/:recipientId')
  @CreateResponseDoc()
  async create(
    @RequestUser() reqUser: TRequestUser,
    @Param('recipientId')
    recipientId: string,
  ) {
    const pendingFriendship = await this.createFriendshipUseCase.execute({
      recipientId,
      senderId: reqUser.id,
    });
    return new FriendshipPresenter(pendingFriendship);
  }

  @Patch('/decline/:senderId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @DeclineResponseDoc()
  async decline(
    @Param('senderId') senderId: string,
    @RequestUser() reqUser: TRequestUser,
  ) {
    await this.declineFriendshipUseCase.execute({
      senderId,
      recipientId: reqUser.id,
    });
  }

  @Get('/my-friends')
  @MyFriendsResponseDoc()
  async myFriends(@RequestUser() reqUser: TRequestUser) {
    const friendships = await this.findAllMyFriendsFriendshipUseCase.execute({
      userId: reqUser.id,
    });
    return new MyFriendsFriendshipPresenter(reqUser.id, friendships);
  }

  @Get('/requests')
  @RequestsResponseDoc()
  async myPendingFriendships(@RequestUser() reqUser: TRequestUser) {
    const friendships = await this.findAllRequestsFriendshipUseCase.execute({
      recipientId: reqUser.id,
    });
    return new RequestsFriendshipPresenter(friendships);
  }
}
