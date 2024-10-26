import { Module } from '@nestjs/common';
import { SeedController } from './seed.controller';
import { NatsModule } from 'src/trasnports/nats.module';

@Module({
  controllers: [SeedController],
  providers: [],
  imports: [NatsModule]
})
export class SeedModule {}
