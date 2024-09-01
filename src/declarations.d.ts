import { requestContext } from '@fastify/request-context';
import { FastifyRequest, FastifyReply } from 'fastify';
import fastify from 'fastify';
import { Authenticate } from './plugins/authentication';
import { Authorize } from './plugins/authorization';
import '@fastify/jwt';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { id: number }; // payload type is used for signing and verifying
    user: {
      age: number;
      id: number;
      name: string;
    }; // user type is return type of `request.user` object
  }
}

declare module '@fastify/request-context' {
  interface RequestContextData {
    requestId: string;
  }
}

declare module 'fastify' {
  type Authorize = (
    request: FastifyRequest,
    reply: FastifyReply,
  ) => Promise<void>;

  interface FastifyInstance
    extends Authenticate,
      Authorize,
      FastifyJwtNamespace<{ namespace: 'security' }> {}

  interface FastifyContextConfig {
    allowedRoles?: string[];
  }
}
