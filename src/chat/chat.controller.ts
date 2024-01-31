import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { RequestUser, TRequestUser } from 'src/shared/decorator.shared';
import {
  ChatControllersDoc,
  CreateResponseDoc,
  FindAllResponseDoc,
  MarkAsReadResponseDoc,
} from './chat.doc';
import { CreateChatDto, FindAllChatDto } from './chat.dto';
import { ChatListPresenter, ChatPresenter } from './chat.presenter';
import {
  CHAT_USECASES,
  TCreateChatUseCase,
  TFindAllChatUseCase,
  TMarkAsReadChatUseCase,
} from './interfaces/use-case.interface';

@Controller('chats')
@ChatControllersDoc()
export class ChatControllers {
  constructor(
    @Inject(CHAT_USECASES.CREATE)
    private readonly createChatUseCase: TCreateChatUseCase,
    @Inject(CHAT_USECASES.FIND_ALL)
    private readonly findAllChatUseCase: TFindAllChatUseCase,
    @Inject(CHAT_USECASES.MARK_AS_READ)
    private readonly markAsReadChatUseCase: TMarkAsReadChatUseCase,
  ) {}

  @Post()
  @CreateResponseDoc()
  async create(
    @Body() dto: CreateChatDto,
    @RequestUser() reqUser: TRequestUser,
  ) {
    const params = {
      msgContent: dto.msgContent,
      recipientId: dto.recipientId,
      senderId: reqUser.id,
    };
    const chat = await this.createChatUseCase.execute(params);
    return new ChatPresenter(chat, reqUser.id);
  }

  @Get()
  @FindAllResponseDoc()
  async findAll(
    @RequestUser() reqUser: TRequestUser,
    @Query() dto: FindAllChatDto,
  ) {
    const chats = await this.findAllChatUseCase.execute({
      userId: reqUser.id,
      ...dto,
    });
    return new ChatListPresenter(chats, reqUser.id);
  }

  @Patch('/mark-as-read/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @MarkAsReadResponseDoc()
  async markAsRead(
    @Param('id') id: string,
    @RequestUser() reqUser: TRequestUser,
  ) {
    await this.markAsReadChatUseCase.execute({
      id,
      userId: reqUser.id,
    });
  }
}
