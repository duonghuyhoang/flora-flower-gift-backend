import * as Joi from '@hapi/joi';

export const configValidationSchema = Joi.object({
  PORT: Joi.number().default(5000),
  STAGE: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(3306).required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required().allow(null, ''),
  DB_DATABASE: Joi.string().required(),
  COOKIE_KEY: Joi.string(),
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),
  EMAIL_ACCOUNT: Joi.string().email(),
  EMAIL_PASSWORD: Joi.string(),
  EMAIL_SERVICE: Joi.string(),
});
