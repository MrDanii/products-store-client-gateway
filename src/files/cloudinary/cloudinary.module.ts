import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryController } from './cloudinary.controller';
import { NatsModule } from 'src/trasnports/nats.module';

@Module({
  controllers: [CloudinaryController],
  providers: [CloudinaryService],
  imports: [NatsModule]
})
export class CloudinaryModule {}
