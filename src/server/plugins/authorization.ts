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
    (
      request: FastifyRequest,
      reply: FastifyReply,
      done: HookHandlerDoneFunction,
    ) => {
      const isAdmin = request.user.admin ?? false;
      if (!isAdmin) {
        done(new Error('Unauthorized'));
      }
      done();
    },
  );

  fastify.decorate(
    'verifyTrustedMember',
    (
      request: FastifyRequest,
      reply: FastifyReply,
      done: HookHandlerDoneFunction,
    ) => {
      const isTrustedMember = request.user.trustedMember ?? false;
      if (!isTrustedMember) {
        done(new Error('Unauthorized'));
      }

      done();
    },
  );
}

export default fp(authorizationPlugin, {
  name: 'authorization',
});
