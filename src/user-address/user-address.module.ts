import { Module } from '@nestjs/common';
import { UserAddressController } from './user-address.controller';
import { NatsModule } from 'src/trasnports/nats.module';

@Module({
  controllers: [UserAddressController],
  providers: [],
  imports: [NatsModule]
})
export class UserAddressModule {}
