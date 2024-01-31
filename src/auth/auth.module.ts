import { Module, Provider } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/user/user.module';
import { AuthControllers } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthServices } from './auth.service';
import { AUTH_SERVICES } from './interfaces/service.interface';
import { AUTH_USE_CASES } from './interfaces/use-case.interface';
import { RegisterAuthUseCase } from './use-cases/register.usecase';
import { SignInAuthUseCase } from './use-cases/sign-in.usecase';

const providers: Provider[] = [
  {
    useClass: AuthServices,
    provide: AUTH_SERVICES,
  },
  {
    useClass: SignInAuthUseCase,
    provide: AUTH_USE_CASES.SIGN_IN,
  },
  {
    useClass: RegisterAuthUseCase,
    provide: AUTH_USE_CASES.REGISTER,
  },
];

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '2h' },
    }),
  ],
  controllers: [AuthControllers],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    ...providers,
  ],
  exports: [...providers],
})
export class AuthModule {}
