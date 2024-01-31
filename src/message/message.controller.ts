import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { RequestUser, TRequestUser } from 'src/shared/decorator.shared';
import { PaginationDto } from 'src/shared/dto.shared';
import {
  MESSAGE_USE_CASES,
  TMessageUseCaseFindAll,
  TMessageUseCaseSend,
} from './interfaces/use-case.interface';
import {
  FindAllResponseDoc,
  MessageControllersDoc,
  SendResponseDoc,
} from './message.doc';
import { SendMessageDto } from './message.dto';
import { MessageListPresenter, MessagePresenter } from './message.presenter';

@Controller('messages')
@MessageControllersDoc()
export class MessageControllers {
  constructor(
    @Inject(MESSAGE_USE_CASES.FIND_ALL)
    private readonly messageUseCaseFindAll: TMessageUseCaseFindAll,
    @Inject(MESSAGE_USE_CASES.SEND)
    private readonly messageUseCaseSend: TMessageUseCaseSend,
  ) {}

  @Get('/:chatId')
  @FindAllResponseDoc()
  async findAll(
    @Param('chatId') id: string,
    @Query() paginationInput: PaginationDto,
  ) {
    const messages = await this.messageUseCaseFindAll.execute({
      chatId: id,
      ...paginationInput,
    });
    return new MessageListPresenter(messages);
  }

  @Post('/:chatId')
  @SendResponseDoc()
  async send(
    @Param('chatId') chatId: string,
    @Body() dto: SendMessageDto,
    @RequestUser() reqUser: TRequestUser,
  ) {
    const params = {
      content: dto.content,
      ownerId: reqUser.id,
      chatId,
    };
    const message = await this.messageUseCaseSend.execute(params);
    return new MessagePresenter(message);
  }
}
