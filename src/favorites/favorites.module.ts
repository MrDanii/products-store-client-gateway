import { Module } from '@nestjs/common';
import { FavoritesController } from './favorites.controller';
import { NatsModule } from 'src/trasnports/nats.module';

@Module({
  controllers: [FavoritesController],
  providers: [],
  imports: [NatsModule]
})
export class FavoritesModule { }
