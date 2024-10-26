import { Module } from '@nestjs/common';
import { HealthCheckModule } from './health-check/health-check.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { OrdersModule } from './orders/orders.module';
import { CartModule } from './cart/cart.module';
import { UserAddressModule } from './user-address/user-address.module';
import { FavoritesModule } from './favorites/favorites.module';
import { CloudinaryModule } from './files/cloudinary/cloudinary.module';
import { UserEditModule } from './user-edit/user-edit.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [HealthCheckModule, AuthModule, ProductModule, OrdersModule, CartModule, UserAddressModule, FavoritesModule, CloudinaryModule, UserEditModule, SeedModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
