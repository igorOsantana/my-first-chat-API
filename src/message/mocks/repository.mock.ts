/* eslint-disable @typescript-eslint/no-unused-vars */
import { Right } from '../../shared/helpers.shared';
import {
  TMessageRepository,
  TMessageRepositoryCreateInput,
  TMessageRepositoryCreateOutput,
  TMessageRepositoryFindAllInput,
  TMessageRepositoryFindAllOutput,
} from '../interfaces/repository.interface';
import { MessageEntityMock } from './entity.mock';

export class MessageRepositoryMock implements TMessageRepository {
  create(
    input: TMessageRepositoryCreateInput,
  ): Promise<TMessageRepositoryCreateOutput> {
    return Promise.resolve(new Right(MessageEntityMock.create(input)));
  }

  async findAll(
    input: TMessageRepositoryFindAllInput,
  ): Promise<TMessageRepositoryFindAllOutput> {
    const list = [
      MessageEntityMock.create(),
      MessageEntityMock.create(),
      MessageEntityMock.create(),
    ];
    const meta = {
      skipped: input.skip || 0,
      taken: list.length,
      total: list.length,
    };
    return Promise.resolve(new Right({ list, meta }));
  }
}

export function getMessageRepositorySpies(
  messageRepository: MessageRepositoryMock,
) {
  return {
    createSpy: jest.spyOn(messageRepository, 'create'),
    findAllSpy: jest.spyOn(messageRepository, 'findAll'),
  };
}
