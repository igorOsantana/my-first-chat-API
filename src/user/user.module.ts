import { Module, Provider } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/database/database.module';
import { USER_REPOSITORY } from './interfaces/repository.interface';
import { USER_USE_CASES } from './interfaces/use-case.interface';
import { CreateUserUseCase } from './use-cases/create.usecase';
import { FindByUserUseCase } from './use-cases/find-by.usecase';
import { UserControllers } from './user.controller';
import { UserRepository } from './user.repository';

const providers: Provider[] = [
  {
    useClass: CreateUserUseCase,
    provide: USER_USE_CASES.CREATE,
  },
  {
    useClass: FindByUserUseCase,
    provide: USER_USE_CASES.FIND_BY,
  },
  {
    useClass: UserRepository,
    provide: USER_REPOSITORY,
  },
];

@Module({
  imports: [DatabaseModule],
  controllers: [UserControllers],
  providers: [...providers],
  exports: [...providers],
})
export class UsersModule {}
