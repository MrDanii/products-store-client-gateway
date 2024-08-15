import { Module } from '@nestjs/common';
import { HealthCheckModule } from './health-check/health-check.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { OrdersModule } from './orders/orders.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [HealthCheckModule, AuthModule, ProductModule, OrdersModule, CartModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
