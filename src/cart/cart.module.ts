import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { NatsModule } from 'src/trasnports/nats.module';

@Module({
  controllers: [CartController],
  providers: [],
  imports: [NatsModule]
})
export class CartModule {}
