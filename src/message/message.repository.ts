import { Injectable } from '@nestjs/common';
import {
  PaginationInputHelper,
  PaginationOutputHelper,
  Right,
} from 'src/shared/helpers.shared';
import { DatabaseServices } from '../shared/database/database.service';
import {
  TMessageRepository,
  TMessageRepositoryCreateInput,
  TMessageRepositoryCreateOutput,
  TMessageRepositoryFindAllInput,
  TMessageRepositoryFindAllOutput,
} from './interfaces/repository.interface';
import { MessageRepositoryAdapter } from './message.adapter';

@Injectable()
export class MessageRepository implements TMessageRepository {
  constructor(private readonly databaseServices: DatabaseServices) {}

  async create(
    input: TMessageRepositoryCreateInput,
  ): Promise<TMessageRepositoryCreateOutput> {
    return await this.databaseServices.$transaction(async (tx) => {
      const newMsg = await tx.message.create({
        data: {
          content: input.content,
          chat: { connect: { id: input.chatId } },
          sender: { connect: { id: input.ownerId } },
        },
        include: { sender: true },
      });

      await tx.chat.update({
        where: { id: input.chatId },
        data: { lastMsg: input.content },
      });

      const output = MessageRepositoryAdapter.exec(newMsg);
      return new Right(output);
    });
  }

  async findAll(
    input: TMessageRepositoryFindAllInput,
  ): Promise<TMessageRepositoryFindAllOutput> {
    const { skip, take } = PaginationInputHelper.exec(input);
    const queryWhere = { where: { chatId: input.chatId } };

    const [messages, total] = await Promise.all([
      this.databaseServices.message.findMany({
        ...queryWhere,
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      }),
      this.databaseServices.message.count(queryWhere),
    ]);

    const output = PaginationOutputHelper.exec(
      MessageRepositoryAdapter.exec(messages),
      skip,
      total,
    );
    return new Right(output);
  }
}
