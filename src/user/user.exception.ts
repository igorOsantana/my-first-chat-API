import { ApiException } from '../shared/exception.shared';

export class UserExceptions {
  static readonly NotFound = new ApiException().notFound('User not found');
  static readonly EmailInUse = new ApiException().conflict(
    'The email address you provided is already registered',
  );
}
