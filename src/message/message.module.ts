import { Module, Provider } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { ChatModule } from 'src/chat/chat.module';
import { DatabaseModule } from 'src/shared/database/database.module';
import { MESSAGE_REPOSITORY } from './interfaces/repository.interface';
import { MESSAGE_USE_CASES } from './interfaces/use-case.interface';
import { MessageControllers } from './message.controller';
import { MessageWebSocketGateway } from './message.gateway';
import { MessageRepository } from './message.repository';
import { MessageUseCaseFindAll } from './use-cases/find-all.usecase';
import { MessageUseCaseSend } from './use-cases/send.usecase';

const providers: Provider[] = [
  {
    useClass: MessageUseCaseFindAll,
    provide: MESSAGE_USE_CASES.FIND_ALL,
  },
  {
    useClass: MessageUseCaseSend,
    provide: MESSAGE_USE_CASES.SEND,
  },
  {
    useClass: MessageRepository,
    provide: MESSAGE_REPOSITORY,
  },
  MessageWebSocketGateway,
];
@Module({
  imports: [DatabaseModule, ChatModule, AuthModule],
  controllers: [MessageControllers],
  providers: [...providers],
  exports: [...providers],
})
export class MessageModule {}
