import { Static, Type } from '@sinclair/typebox';
import envSchema from 'env-schema';

const NodeEnvSchema = Type.Union([
  Type.Literal('development'),
  Type.Literal('production'),
  Type.Literal('test'),
]);

export type NodeEnv = Static<typeof NodeEnvSchema>;

const LogLevelSchema = Type.Union([
  Type.Literal('error'),
  Type.Literal('warn'),
  Type.Literal('info'),
  Type.Literal('debug'),
]);

export type LogLevel = Static<typeof LogLevelSchema>;

const schema = Type.Object({
  HOST: Type.String({ default: 'localhost' }),
  LOG_LEVEL: LogLevelSchema,
  NODE_ENV: NodeEnvSchema,
  PORT: Type.Number({ default: 3000 }),
  // TODO: Use when I have db.
  // POSTGRES_DB: Type.String(),
  // POSTGRES_PASSWORD: Type.String(),
  // POSTGRES_URL: Type.String(),
  // POSTGRES_USER: Type.String(),
});

const internalEnv = envSchema<Static<typeof schema>>({
  dotenv: true,
  schema,
});

export const env = {
  isDevelopment: internalEnv.NODE_ENV === NodeEnvSchema.development,
  isProduction: internalEnv.NODE_ENV === NodeEnvSchema.production,
  log: {
    level: internalEnv.LOG_LEVEL,
  },
  nodeEnv: internalEnv.NODE_ENV,
  server: {
    host: internalEnv.HOST,
    port: internalEnv.PORT,
  },
  version: process.env.npm_package_version ?? '0.0.0',
};
