import { ApiException } from '../shared/exception.shared';

export class ChatExceptions {
  static readonly NotFound = new ApiException().notFound('Chat not found');
  static readonly RecipientNotFound = new ApiException().notFound(
    'Recipient not found',
  );
  static readonly AlreadyExists = new ApiException().conflict(
    'Chat already exists',
  );
}
