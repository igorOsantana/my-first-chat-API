import { ApiException } from '../shared/exception.shared';

export class FriendshipExceptions extends ApiException {
  static readonly AlreadyExists = new ApiException().badRequest(
    'A request for friendship already exists',
  );
  static readonly NotFound = new ApiException().notFound(
    'The friendship was not found',
  );
}
