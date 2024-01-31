import { Module, Provider } from '@nestjs/common';
import { CHAT_REPOSITORY } from '../interfaces/repository.interface';
import { ChatRepositoryMock } from './repository.mock';

const providers: Provider[] = [
  { provide: CHAT_REPOSITORY, useClass: ChatRepositoryMock },
];

@Module({
  providers: [...providers],
  exports: [...providers],
})
export class ChatModuleMock {}
