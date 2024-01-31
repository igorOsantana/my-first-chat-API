import { ApiException } from 'src/shared/exception.shared';

export class MessageExceptions extends ApiException {
  static readonly ChatNotFound = new ApiException().notFound('Chat not found');
}
