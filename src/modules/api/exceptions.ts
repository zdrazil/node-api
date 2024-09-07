import { getRequestId } from './requestContext';

interface SerializedException {
  cause?: string;
  correlationId: string | undefined;
  error: string;
  message: string;
  metadata?: unknown;
  stack?: string;
  statusCode?: number;
}

export abstract class ExceptionBase extends Error {
  abstract error: string;
  abstract statusCode: number;

  public readonly correlationId: string | undefined;

  /**
   * @param {string} message
   * @param cause
   * @param {Object} [metadata={}] **BE CAREFUL** not to include sensitive info
   *   in 'metadata' to prevent leaks since all exception's data will end up in
   *   application's log files. Only include non-sensitive info that may help
   *   with debugging. Default is `{}`
   */
  constructor(
    override readonly message: string,
    override readonly cause?: Error,
    readonly metadata?: unknown,
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.correlationId = getRequestId();
  }

  /**
   * By default in NodeJS Error objects are not serialized properly when sending
   * plain objects to external processes. This method is a workaround. Keep in
   * mind not to return a stack trace to user when in production.
   * https://iaincollins.medium.com/error-handling-in-javascript-a6172ccdf9af
   */
  toJSON(): SerializedException {
    return {
      cause: JSON.stringify(this.cause),
      correlationId: this.correlationId,
      error: this.error,
      message: this.message,
      metadata: this.metadata,
      stack: this.stack,
      statusCode: this.statusCode,
    };
  }
}

/**
 * Used to indicate that an incorrect argument was provided to a
 * method/function/class constructor
 *
 * @class ArgumentInvalidException
 * @extends {ExceptionBase}
 */
export class ArgumentInvalidException extends ExceptionBase {
  readonly statusCode = 400;
  readonly error = 'Bad Request';
}

/**
 * Used to indicate conflicting entities (usually in the database)
 *
 * @class ConflictException
 * @extends {ExceptionBase}
 */
export class ConflictException extends ExceptionBase {
  readonly error = 'Conflict';
  readonly statusCode = 409;
}

/**
 * Used to indicate that entity is not found
 *
 * @class NotFoundException
 * @extends {ExceptionBase}
 */
export class NotFoundException extends ExceptionBase {
  static readonly message = 'Not found';
  readonly error = 'Not Found';
  readonly statusCode = 404;

  constructor(message = NotFoundException.message) {
    super(message);
  }
}

/**
 * Used to indicate an internal server error that does not fall under all other
 * errors
 *
 * @class InternalServerErrorException
 * @extends {ExceptionBase}
 */
export class InternalServerErrorException extends ExceptionBase {
  static readonly message = 'Internal server error';
  readonly error = 'Internal server error';
  constructor(message = InternalServerErrorException.message) {
    super(message);
  }

  readonly statusCode = 500;
}

export class DatabaseErrorException extends ExceptionBase {
  static readonly message = 'Database error';
  readonly error = 'Internal server error';
  constructor(message = InternalServerErrorException.message, cause?: Error) {
    super(message, cause);
  }

  readonly statusCode = 500;
}
