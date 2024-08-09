import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, RequestMethod, ValidationPipe } from '@nestjs/common';
import { envs } from './config/envs';
import { RpcCustomExceptionFilter } from './common';

async function bootstrap() {
  const logger = new Logger('Main-Gateway')

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('store1', {
    exclude: [
      {
        path: '/',
        method: RequestMethod.GET
      },
      // {
      //   path: '/auth/google-auth',
      //   method: RequestMethod.GET
      // },
      // {
      //   path: '/auth/google-redirect',
      //   method: RequestMethod.GET
      // },
    ]
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );
  app.useGlobalFilters(new RpcCustomExceptionFilter())

  await app.listen(envs.port);
  logger.log(`Client-Gateway is up and running in port: ${envs.port}`)
}
bootstrap();
