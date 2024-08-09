import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { NatsModule } from 'src/trasnports/nats.module';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  controllers: [AuthController],
  providers: [
    GoogleStrategy
  ],
  imports: [NatsModule]
})
export class AuthModule { }
