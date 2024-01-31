import { Controller, Get, Inject, Param } from '@nestjs/common';
import {
  TFindByUserUseCase,
  USER_USE_CASES,
} from './interfaces/use-case.interface';
import { FindByIdOrEmailResponseDoc, UserControllersDoc } from './user.doc';
import { UserPresenter } from './user.presenter';

@Controller('users')
@UserControllersDoc()
export class UserControllers {
  constructor(
    @Inject(USER_USE_CASES.FIND_BY)
    private readonly findByUserUseCase: TFindByUserUseCase,
  ) {}

  @Get('/:idOrEmail')
  @FindByIdOrEmailResponseDoc()
  async findByIdOrEmail(@Param('idOrEmail') idOrEmail: string) {
    const user = await this.findByUserUseCase.execute({
      by: 'idOrEmail',
      value: idOrEmail,
    });
    return new UserPresenter(user);
  }
}
