import { ApiException } from '../shared/exception.shared';

export class AuthExceptions {
  static readonly InvalidCredentials = new ApiException().unauthorized(
    'Email or password is incorrect',
  );
  static readonly Unauthorized = new ApiException().unauthorized(
    'You are not authorized',
  );
}
