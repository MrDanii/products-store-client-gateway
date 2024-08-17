import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { ProductFavoriteDto } from './dto';
import { AuthGuard } from 'src/auth/guard';
import { User } from 'src/auth/decorators';
import { UserJwtDto } from 'src/common';
import { catchError } from 'rxjs';

@Controller('favorites')
export class FavoritesController {
  constructor(
    @Inject(NATS_SERVICE) private readonly natsClient: ClientProxy
  ) { }

  @Post()
  @UseGuards(AuthGuard)
  addFavorite(@Body() productFavoriteDto: ProductFavoriteDto, @User() user: UserJwtDto) {
    productFavoriteDto.idUser = user.id

    return this.natsClient.send('favorite.add.one', productFavoriteDto).pipe(
      catchError((error) => {
        throw new RpcException(error)
      })
    )
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@User() user: UserJwtDto) {
    return this.natsClient.send('favorite.find.all', user.id).pipe(
      catchError((error) => {
        throw new RpcException(error)
      })
    )
  }

  @Delete(':idProduct')
  @UseGuards(AuthGuard)
  removeFavorite(@Param('idProduct', ParseUUIDPipe) idProduct: string, @User() user: UserJwtDto) {
    const productFavoriteDto: ProductFavoriteDto = { idUser: user.id, productId: idProduct }

    return this.natsClient.send('favorite.remove.one', productFavoriteDto).pipe(
      catchError((error) => {
        throw new RpcException(error)
      })
    )
  }

  @Delete('')
  @UseGuards(AuthGuard)
  removeAllFavorites(@User() user: UserJwtDto) {
    return this.natsClient.send('favorite.remove.all', user.id).pipe(
      catchError((error) => {
        throw new RpcException(error)
      })
    )
  }
}
