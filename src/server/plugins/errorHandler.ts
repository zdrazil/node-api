import { FastifyError, FastifyErrorCodes, FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import {
  ApiErrorResponse,
  apiErrorResponseSchema,
} from '../../modules/api/apiErrorResponse';
import { getRequestId } from '../../modules/api/requestContext';
import { ExceptionBase } from '../../modules/api/exceptions';

const fastifyErrorCodesMap: Record<
  string,
  (error: FastifyError) => {
    correlationId?: string;
    error: string;
    message: string;
    statusCode: number;
  }
> = {
  FST_ERR_NOT_FOUND: () => ({
    error: 'Not Found',
    message: 'Not Found',
    statusCode: 404, //  'https://datatracker.ietf.org/doc/html/rfc7231#section-6.5.4',
  }),
  FST_ERR_VALIDATION: (error: FastifyError) => ({
    error: 'Bad Request',
    message: 'Validation error',
    statusCode: 400,
    subErrors: (error.validation ?? []).map((validationError) => ({
      message: validationError.message ?? '',
      path: validationError.instancePath,
    })), // https://datatracker.ietf.org/doc/html/rfc7231#section-6.5.1
  }),
};

async function errorHandlerPlugin(fastify: FastifyInstance) {
  fastify.setErrorHandler((error: FastifyError | Error, _, res) => {
    if ('code' in error) {
      const fastifyError = fastifyErrorCodesMap[error.code];

      if (fastifyError) {
        const response = fastifyError(error);
        response.correlationId = getRequestId();
        return res.status(response.statusCode).send(response);
      }
    }

    // Catch all other errors
    fastify.log.error(error);
    if (error instanceof ExceptionBase) {
      return res.status(error.statusCode).send({
        correlationId: getRequestId(),
        error: error.error,
        message: error.message,
        statusCode: error.statusCode,
      } satisfies ApiErrorResponse);
    }

    return res.status(500).send({
      correlationId: getRequestId(),
      // https://datatracker.ietf.org/doc/html/rfc7231#section-6.6.1
      error: 'Internal Server Error',
      message: 'Internal Server Error',
      statusCode: 500,
    } satisfies ApiErrorResponse);
  });

  fastify.addSchema(apiErrorResponseSchema);
}

export default fp(errorHandlerPlugin, {
  name: 'errorHandler',
});
