import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseServices } from '../shared/database/database.service';
import { Left, PaginationInputHelper, Right } from '../shared/helpers.shared';
import { ChatEntity } from './chat.entity';
import { ChatExceptions } from './chat.exception';
import {
  TChatRepository,
  TChatRepositoryCreateInput,
  TChatRepositoryFindAllInput,
  TChatRepositoryFindAllOutput,
  TChatRepositoryFindOneOutput,
  TChatRepositoryMarkAsReadInput,
  TChatRepositoryMarkAsReadOutput,
} from './interfaces/repository.interface';

@Injectable()
export class ChatRepository implements TChatRepository {
  constructor(private readonly databaseServices: DatabaseServices) {}

  async create(
    input: TChatRepositoryCreateInput,
  ): Promise<TChatRepositoryFindOneOutput> {
    const newChat = await this.databaseServices.chat.create({
      data: {
        lastMsg: input.msgContent,
        participants: {
          createMany: {
            data: [
              { userId: input.senderId, read: true },
              { userId: input.recipientId, read: false },
            ],
          },
        },
        messages: {
          create: {
            content: input.msgContent,
            senderId: input.senderId,
          },
        },
      },
      include: {
        participants: { include: { user: true } },
      },
    });
    return new Right(new ChatEntity(newChat));
  }

  async findAll(
    input: TChatRepositoryFindAllInput,
  ): Promise<TChatRepositoryFindAllOutput> {
    const { take, skip } = PaginationInputHelper.exec(input);
    const findAllQuery: Prisma.ChatFindManyArgs = {
      include: {
        participants: { include: { user: true } },
      },
      orderBy: { updatedAt: 'asc' },
      take,
      skip,
    };
    const countQuery: Prisma.ChatCountArgs = {};

    if (input.userId) {
      const whereQuery = {
        participants: { some: { userId: input.userId } },
      };
      findAllQuery.where = whereQuery;
      countQuery.where = whereQuery;
    }

    const [chats, total] = await Promise.all([
      this.databaseServices.chat.findMany(findAllQuery),
      this.databaseServices.chat.count(countQuery),
    ]);
    return new Right(new ChatEntity().list(chats, skip, total));
  }

  async findById(id: string): Promise<TChatRepositoryFindOneOutput> {
    return await this.findBy({ where: { id } });
  }

  async findByParticipants(
    ids: string[],
  ): Promise<TChatRepositoryFindOneOutput> {
    return await this.findBy({
      where: { participants: { every: { userId: { in: ids } } } },
    });
  }

  private async findBy(
    query: Prisma.ChatFindFirstArgs,
  ): Promise<TChatRepositoryFindOneOutput> {
    query.include = { participants: { include: { user: true } } };

    const chat = await this.databaseServices.chat.findFirst(query);

    if (!chat) {
      return new Left(ChatExceptions.NotFound);
    }

    return new Right(new ChatEntity(chat));
  }

  async markAsRead({
    id,
    userId,
  }: TChatRepositoryMarkAsReadInput): Promise<TChatRepositoryMarkAsReadOutput> {
    await this.databaseServices.chat.update({
      where: { id },
      data: {
        participants: {
          update: {
            where: { chatId_userId: { chatId: id, userId } },
            data: { read: true },
          },
        },
      },
    });
    return new Right();
  }
}
