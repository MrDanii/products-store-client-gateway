import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number,
  NATS_SERVERS: string[],

  GOOGLE_CLIENT_ID: string,
  GOOGLE_CLIENT_SECRET: string,
  GOOGLE_CLIENT_CALLBACK_URL: string
}

const envsSchema = joi.object({
  PORT: joi.number().required(),
  NATS_SERVERS: joi.array().items(joi.string()).required(),

  //? This variables are not strictly necessary but will let them required to avoid problems with google authentication (OAuth 2.0)
  GOOGLE_CLIENT_ID: joi.string().required(),
  GOOGLE_CLIENT_SECRET: joi.string().required(),
  GOOGLE_CLIENT_CALLBACK_URL: joi.string().required()
})
.unknown(true)

const {value, error} = envsSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS?.split(',')
})

if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

const envVars: EnvVars = value

export const envs = {
  port: envVars.PORT,
  natsServers: envVars.NATS_SERVERS,
  
  googleClientId: envVars.GOOGLE_CLIENT_ID,
  googleClientSecret: envVars.GOOGLE_CLIENT_SECRET,
  googleClientCallbackUrl: envVars.GOOGLE_CLIENT_CALLBACK_URL
}