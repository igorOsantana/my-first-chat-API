import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { UserEntity } from 'src/user/user.entity';
import {
  TAuthServices,
  TAuthServicesGenerateTokensOutput,
  TAuthServicesToken,
} from './interfaces/service.interface';

@Injectable()
export class AuthServices implements TAuthServices {
  constructor(private readonly jwtService: JwtService) {}

  async hash(input: string): Promise<string> {
    return await hash(input, 10);
  }

  async compare(input: string, hash: string): Promise<boolean> {
    return await compare(input, hash);
  }

  verifyToken(token: string): TAuthServicesToken {
    return this.jwtService.verify(token);
  }

  generateTokens(user: UserEntity): TAuthServicesGenerateTokensOutput {
    const accessToken = this.generateToken(user);
    const refreshToken = this.generateToken(user, '5d');
    return { accessToken, refreshToken };
  }

  private generateToken(user: UserEntity, expiresIn?: string): string {
    const payload = { sub: user.id, username: user.name };
    return this.jwtService.sign(payload, { expiresIn });
  }
}
