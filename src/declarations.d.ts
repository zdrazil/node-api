import { requestContext } from '@fastify/request-context';
import { FastifyRequest, FastifyReply } from 'fastify';
import fastify from 'fastify';
import { Authenticate } from './server/plugins/authentication';
import { Authorize } from './server/plugins/authorization';
import '@fastify/jwt';
import { JwtPayload } from './modules/identity/schema';
import { Role } from './modules/authorization/roles';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: JwtPayload; // payload type is used for signing and verifying
    user: {
      admin?: boolean;
      email: string;
      id: number;
      trustedMember?: boolean;
      userId: string;
    }; // user type is return type of `request.user` object
  }
}

declare module '@fastify/request-context' {
  interface RequestContextData {
    requestId: string;
  }
}

declare module 'fastify' {
  interface FastifyInstance
    extends FastifyJwtNamespace<{ namespace: 'security' }> {
    authenticate: Authenticate;
    verifyAdmin: Authorize;
    verifyTrustedMember: Authorize;
  }

  // interface FastifyContextConfig {
  //   allowedRoles?: Role[];
  // }
}
