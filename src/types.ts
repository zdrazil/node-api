import { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';
import {
  FastifyBaseLogger,
  FastifyInstance,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
} from 'fastify';

// Ensures HTTP request is strongly typed from the schema
export type FastifyRouteInstance = FastifyInstance<
  RawServerDefault,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
  FastifyBaseLogger,
  JsonSchemaToTsProvider
>;
