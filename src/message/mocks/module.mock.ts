import { Module, Provider } from '@nestjs/common';
import { MESSAGE_REPOSITORY } from '../interfaces/repository.interface';
import { MessageRepositoryMock } from './repository.mock';

const providers: Provider[] = [
  { provide: MESSAGE_REPOSITORY, useClass: MessageRepositoryMock },
];

@Module({
  providers: [...providers],
  exports: [...providers],
})
export class MessageModuleMock {}
