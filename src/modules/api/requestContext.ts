import { requestContext } from '@fastify/request-context';

// Get request ID
export function getRequestId(): string | undefined {
  return requestContext.get('requestId');
}
