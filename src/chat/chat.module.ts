import { Module, Provider } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/database/database.module';
import { UsersModule } from 'src/user/user.module';
import { ChatControllers } from './chat.controller';
import { ChatRepository } from './chat.repository';
import { CHAT_REPOSITORY } from './interfaces/repository.interface';
import { CHAT_USECASES } from './interfaces/use-case.interface';
import { CreateChatUseCase } from './use-cases/create.usecase';
import { FindAllChatUseCase } from './use-cases/find-all.usecase';
import { FindByIdChatUseCase } from './use-cases/find-by-id.usecase';
import { MarkAsReadChatUseCase } from './use-cases/mark-as-read.usecase';

const providers: Provider[] = [
  {
    useClass: CreateChatUseCase,
    provide: CHAT_USECASES.CREATE,
  },
  {
    useClass: FindAllChatUseCase,
    provide: CHAT_USECASES.FIND_ALL,
  },
  {
    useClass: FindByIdChatUseCase,
    provide: CHAT_USECASES.FIND_BY_ID,
  },
  {
    useClass: MarkAsReadChatUseCase,
    provide: CHAT_USECASES.MARK_AS_READ,
  },
  {
    useClass: ChatRepository,
    provide: CHAT_REPOSITORY,
  },
];

@Module({
  imports: [DatabaseModule, UsersModule],
  controllers: [ChatControllers],
  providers: [...providers],
  exports: [...providers],
})
export class ChatModule {}
