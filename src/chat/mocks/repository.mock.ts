/* eslint-disable @typescript-eslint/no-unused-vars */
import { Right } from '../../shared/helpers.shared';
import { UserEntityMock } from '../../user/mocks/entity.mock';
import {
  TChatRepository,
  TChatRepositoryCreateInput,
  TChatRepositoryFindAllInput,
  TChatRepositoryFindAllOutput,
  TChatRepositoryFindOneOutput,
  TChatRepositoryMarkAsReadInput,
  TChatRepositoryMarkAsReadOutput,
} from '../interfaces/repository.interface';
import { ChatEntityMock } from './entity.mock';

export class ChatRepositoryMock implements TChatRepository {
  create(
    input: TChatRepositoryCreateInput,
  ): Promise<TChatRepositoryFindOneOutput> {
    return Promise.resolve(
      new Right(
        ChatEntityMock.create({
          lastMessage: input.msgContent,
          sender: {
            ...UserEntityMock.create(),
            id: input.senderId,
          },
          recipient: {
            ...UserEntityMock.create(),
            id: input.recipientId,
          },
        }),
      ),
    );
  }

  findAll(
    input: TChatRepositoryFindAllInput,
  ): Promise<TChatRepositoryFindAllOutput> {
    const list = [
      ChatEntityMock.create(),
      ChatEntityMock.create(),
      ChatEntityMock.create(),
    ];
    const meta = {
      skipped: input.skip || 0,
      taken: list.length,
      total: list.length,
    };
    return Promise.resolve(new Right({ list, meta }));
  }

  findById(id: string): Promise<TChatRepositoryFindOneOutput> {
    return Promise.resolve(new Right(ChatEntityMock.create({ id })));
  }

  findByParticipants(_ids: string[]): Promise<TChatRepositoryFindOneOutput> {
    return Promise.resolve(new Right(ChatEntityMock.create()));
  }

  markAsRead(
    _input: TChatRepositoryMarkAsReadInput,
  ): Promise<TChatRepositoryMarkAsReadOutput> {
    return Promise.resolve(new Right());
  }
}

export function getChatRepositorySpies(chatRepository: ChatRepositoryMock) {
  return {
    createSpy: jest.spyOn(chatRepository, 'create'),
    findAllSpy: jest.spyOn(chatRepository, 'findAll'),
    findByIdSpy: jest.spyOn(chatRepository, 'findById'),
    findByParticipantsSpy: jest.spyOn(chatRepository, 'findByParticipants'),
    markAsReadSpy: jest.spyOn(chatRepository, 'markAsRead'),
  };
}
