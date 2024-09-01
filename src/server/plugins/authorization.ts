import fp from 'fastify-plugin';
import auth from '@fastify/auth';
import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';

export type Authorize = (
  request: FastifyRequest,
  reply: FastifyReply,
) => Promise<void>;

async function authorizationPlugin(fastify: FastifyInstance) {
  await fastify.register(auth);

  fastify.decorate(
    'authorize',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const allowedRoles = request.routeOptions.config.allowedRoles;

      if (allowedRoles && request) {
        const userRoles = request.jwtUser.payload.user
          ? request.jwtUser.payload.user.roles
          : [];

        if (!allowedRoles.some((role: any) => userRoles.includes(role))) {
          throw fastify.httpErrors.unauthorized();
        }
      }
    },
  );
}

export default fp(authorizationPlugin, {
  name: 'authorization',
});
