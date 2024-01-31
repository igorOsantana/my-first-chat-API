import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { RequestUser, TRequestUser } from 'src/shared/decorator.shared';
import {
  TFindByUserUseCase,
  USER_USE_CASES,
} from 'src/user/interfaces/use-case.interface';
import { Public } from './auth.decorator';
import {
  AuthControllersDoc,
  MeResponseDoc,
  RegisterResponseDoc,
  SignInResponseDoc,
} from './auth.doc';
import { RegisterAuthDto, SignInAuthDto } from './auth.dto';
import {
  MePresenter,
  RegisterAuthPresenter,
  SignInAuthPresenter,
} from './auth.presenter';
import {
  AUTH_USE_CASES,
  TRegisterAuthUseCase,
  TSignInAuthUseCase,
} from './interfaces/use-case.interface';

@Controller('auth')
@AuthControllersDoc()
export class AuthControllers {
  constructor(
    @Inject(USER_USE_CASES.FIND_BY)
    private readonly findByIdUserUseCase: TFindByUserUseCase,
    @Inject(AUTH_USE_CASES.SIGN_IN)
    private readonly signInAuthUseCase: TSignInAuthUseCase,
    @Inject(AUTH_USE_CASES.REGISTER)
    private readonly registerAuthUseCase: TRegisterAuthUseCase,
  ) {}

  @Get('/me')
  @MeResponseDoc()
  async me(@RequestUser() reqUser: TRequestUser) {
    const user = await this.findByIdUserUseCase.execute({
      by: 'id',
      value: reqUser.id,
    });
    return new MePresenter(user);
  }

  @Public()
  @Post('/sign-in')
  @HttpCode(HttpStatus.OK)
  @SignInResponseDoc()
  async signIn(@Body() dto: SignInAuthDto) {
    const { email, password } = dto;
    const tokens = await this.signInAuthUseCase.execute({
      email,
      password,
    });
    return new SignInAuthPresenter(tokens.accessToken);
  }

  @Public()
  @Post('/register')
  @RegisterResponseDoc()
  async register(@Body() dto: RegisterAuthDto) {
    const tokens = await this.registerAuthUseCase.execute(dto);
    return new RegisterAuthPresenter(tokens.accessToken);
  }
}
