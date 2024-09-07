import { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';
import { Type } from '@sinclair/typebox';
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

// https://stackoverflow.com/questions/78825482/fastify-swagger-not-managing-enumerators-as-expected
export const StringEnum = <T extends string[]>(items: [...T]) =>
  Type.Unsafe<T[number]>({ enum: items, type: 'string' });
