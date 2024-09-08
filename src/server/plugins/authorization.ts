import fp from 'fastify-plugin';
import auth from '@fastify/auth';
import {
  FastifyRequest,
  FastifyReply,
  FastifyInstance,
  HookHandlerDoneFunction,
} from 'fastify';
import { ExceptionBase } from '../../modules/api/exceptions';

/**
 * Used to indicate that the user is not authorized to access a resource.
 */
class AuthorizationError extends ExceptionBase {
  readonly statusCode = 401;
  readonly error = 'Unauthorized';
}

export type Authorize = (
  request: FastifyRequest,
  reply: FastifyReply,
  done: HookHandlerDoneFunction,
) => void;

async function authorizationPlugin(fastify: FastifyInstance) {
  await fastify.register(auth);

  fastify.decorate(
    'verifyAdmin',
    async (request: FastifyRequest, reply: FastifyReply) => {
      await fastify.authenticate(request, reply);

      const isAdmin = request.user.admin ?? false;
      if (!isAdmin) {
        throw new AuthorizationError('Unauthorized');
      }
    },
  );

  fastify.decorate(
    'verifyTrustedMember',
    async (request: FastifyRequest, reply: FastifyReply) => {
      await fastify.authenticate(request, reply);

      const isTrustedMember = request.user.trustedMember ?? false;
      if (!isTrustedMember) {
        throw new AuthorizationError('Unauthorized');
      }
    },
  );
}

export default fp(authorizationPlugin, {
  name: 'authorization',
});
