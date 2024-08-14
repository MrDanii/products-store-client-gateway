import { Module } from '@nestjs/common';
import { HealthCheckModule } from './health-check/health-check.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [HealthCheckModule, AuthModule, ProductModule, OrdersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
