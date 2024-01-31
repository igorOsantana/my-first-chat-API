import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseServices } from '../shared/database/database.service';
import { Left, Right } from '../shared/helpers.shared';
import {
  TUserRepository,
  TUserRepositoryCreateInput,
  TUserRepositoryFindOneOutput,
} from './interfaces/repository.interface';
import { UserExceptions } from './user.exception';

@Injectable()
export class UserRepository implements TUserRepository {
  constructor(private readonly databaseServices: DatabaseServices) {}

  async create(
    input: TUserRepositoryCreateInput,
  ): Promise<TUserRepositoryFindOneOutput> {
    const user = await this.databaseServices.user.create({
      data: input,
    });
    return new Right(user);
  }

  async findById(id: string): Promise<TUserRepositoryFindOneOutput> {
    return await this.findBy({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<TUserRepositoryFindOneOutput> {
    return await this.findBy({
      where: { email },
    });
  }

  async findByIdOrEmail(
    idOrEmail: string,
  ): Promise<TUserRepositoryFindOneOutput> {
    return await this.findBy({
      where: { OR: [{ id: idOrEmail }, { email: idOrEmail }] },
    });
  }

  private async findBy(
    query: Prisma.UserFindFirstArgs,
  ): Promise<TUserRepositoryFindOneOutput> {
    const user = await this.databaseServices.user.findFirst(query);

    if (!user) {
      return new Left(UserExceptions.NotFound);
    }

    return new Right(user);
  }
}
