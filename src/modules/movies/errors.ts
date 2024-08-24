import { ConflictException } from '../exceptions/exceptions';

export class MovieAlreadyExistsError extends ConflictException {
  static readonly message = 'Movie already exists';

  constructor(cause?: Error, metadata?: unknown) {
    super(MovieAlreadyExistsError.message, cause, metadata);
  }
}
