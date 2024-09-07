import fp from 'fastify-plugin';
import auth from '@fastify/auth';
import {
  FastifyRequest,
  FastifyReply,
  FastifyInstance,
  HookHandlerDoneFunction,
} from 'fastify';

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
        throw new Error('Unauthorized');
      }
    },
  );

  fastify.decorate(
    'verifyTrustedMember',
    async (request: FastifyRequest, reply: FastifyReply) => {
      await fastify.authenticate(request, reply);

      const isTrustedMember = request.user.trustedMember ?? false;
      if (!isTrustedMember) {
        throw new Error('Unauthorized');
      }
    },
  );
}

export default fp(authorizationPlugin, {
  name: 'authorization',
});
