import { Module } from '@nestjs/common';
import { UserEditController } from './user-edit.controller';
import { NatsModule } from 'src/trasnports/nats.module';

@Module({
  controllers: [UserEditController],
  providers: [],
  imports: [NatsModule]
})
export class UserEditModule {}
