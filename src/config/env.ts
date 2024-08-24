import { Static, Type } from '@sinclair/typebox';
import envSchema from 'env-schema';

export const NodeEnv = {
  development: 'development',
  production: 'production',
  test: 'test',
} as const;

export const LogLevel = {
  debug: 'debug',
  error: 'error',
  info: 'info',
  warn: 'warn',
} as const;

const schema = Type.Object({
  HOST: Type.String({ default: 'localhost' }),
  LOG_LEVEL: Type.Enum(LogLevel),
  NODE_ENV: Type.Enum(NodeEnv),
  PORT: Type.Number({ default: 3000 }),
  POSTGRES_DB: Type.String(),
  POSTGRES_PASSWORD: Type.String(),
  POSTGRES_URL: Type.String(),
  POSTGRES_USER: Type.String(),
});

const internalEnv = envSchema<Static<typeof schema>>({
  dotenv: true,
  schema,
});

export const env = {
  isDevelopment: internalEnv.NODE_ENV === NodeEnv.development,
  isProduction: internalEnv.NODE_ENV === NodeEnv.production,
  log: {
    level: internalEnv.LOG_LEVEL,
  },
  nodeEnv: internalEnv.NODE_ENV,
  server: {
    host: internalEnv.HOST,
    port: internalEnv.PORT,
  },
  version: process.env.npm_package_version ?? '0.0.0',
  db: {
    url: `postgres://${internalEnv.POSTGRES_USER}:${internalEnv.POSTGRES_PASSWORD}@${internalEnv.POSTGRES_URL}/${internalEnv.POSTGRES_DB}?sslmode=disable`,
  },
};
