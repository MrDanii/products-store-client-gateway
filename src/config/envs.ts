import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number,
  NATS_SERVERS: string[],

  GOOGLE_CLIENT_ID: string,
  GOOGLE_CLIENT_SECRET: string,
  GOOGLE_CLIENT_CALLBACK_URL: string,

  CLOUDINARY_CLOUD_NAME: string,
  CLOUDINARY_API_KEY: string,
  CLOUDINARY_API_SECRET: string,
  CLOUDINARY_URL: string,
}

const envsSchema = joi.object({
  PORT: joi.number().required(),
  NATS_SERVERS: joi.array().items(joi.string()).required(),

  //? This variables are not strictly necessary but will let them required to avoid problems with google authentication (OAuth 2.0)
  GOOGLE_CLIENT_ID: joi.string().required(),
  GOOGLE_CLIENT_SECRET: joi.string().required(),
  GOOGLE_CLIENT_CALLBACK_URL: joi.string().required(),

  //? Necessary for cloud storage images
  CLOUDINARY_CLOUD_NAME: joi.string(),
  CLOUDINARY_API_KEY: joi.string(),
  CLOUDINARY_API_SECRET: joi.string(),
  CLOUDINARY_URL: joi.string(),
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
  googleClientCallbackUrl: envVars.GOOGLE_CLIENT_CALLBACK_URL,

  cloudinaryCloudName: envVars.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: envVars.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: envVars.CLOUDINARY_API_SECRET,
  cloudinaryUrl: envVars.CLOUDINARY_URL,
}