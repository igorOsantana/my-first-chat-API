import { HttpException, HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export const INTERNAL_SERVER_ERROR_MESSAGE =
  'The server encountered an error and could not complete your request';

export class ApiException extends HttpException {
  constructor(message?: string, status?: HttpStatus) {
    super(
      message || INTERNAL_SERVER_ERROR_MESSAGE,
      status || HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  private logError(...err: unknown[]) {
    const sanitizeErrors = err.filter(Boolean);

    if (sanitizeErrors.length > 0) {
      console.error(sanitizeErrors);
    }
  }

  internal(service: string, err?: unknown) {
    this.logError(`INTERNAL SERVER ERROR ON ${service}`, err);
    const message =
      'The server encountered an error and could not complete your request';
    return new ApiException(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  notFound(message: string) {
    return new ApiException(message, HttpStatus.NOT_FOUND);
  }

  badRequest(message: string) {
    return new ApiException(message, HttpStatus.BAD_REQUEST);
  }

  conflict(message: string) {
    return new ApiException(message, HttpStatus.CONFLICT);
  }

  unauthorized(message: string) {
    return new ApiException(message, HttpStatus.UNAUTHORIZED);
  }

  forbidden(message: string) {
    return new ApiException(message, HttpStatus.FORBIDDEN);
  }
}

export class ValidationException extends ApiException {
  constructor(validationErrors: ValidationError[]) {
    const formattedErrors = validationErrors.map((error) => {
      const constraints = Object.values(error.constraints);
      return constraints.join(', ');
    });
    super(formattedErrors.join(', '), HttpStatus.BAD_REQUEST);
  }
}
