import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { AuthGuard } from 'src/auth/guard';
import { User } from 'src/auth/decorators';
import { AddCartDetailDto, ShoppingCartDetailsDto, UpdateCartItemDto } from './dto';
import { catchError } from 'rxjs';
import { UserJwtDto } from 'src/common/dto/user-jwt.dto';

@Controller('cart')
export class CartController {
  constructor(
    @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy
  ) { }

  @Post()
  @UseGuards(AuthGuard)
  create(@User() user: UserJwtDto) {
    return this.natsClient.send('cart.create', user.id).pipe(
      catchError((error) => {
        throw new RpcException(error)
      })
    )
  }

  @Post('add-item')
  @UseGuards(AuthGuard)
  addItem(@Body() shoppingCartDetailsDto: ShoppingCartDetailsDto, @User() user: UserJwtDto) {
    const addCartDetailDto: AddCartDetailDto = { idUser: user.id, ...shoppingCartDetailsDto }

    return this.natsClient.send('cart.add.item.one', addCartDetailDto).pipe(
      catchError((error) => {
        throw new RpcException(error)
      })
    )
  }

  @Get()
  @UseGuards(AuthGuard)
  findAllItems(@User() user: UserJwtDto) {
    return this.natsClient.send('cart.find.all', user.id).pipe(
      catchError((error) => {
        throw new RpcException(error)
      })
    )
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
  }

  @Patch()
  @UseGuards(AuthGuard)
  update(@Body() updateCartItemDto: UpdateCartItemDto, @User() user: UserJwtDto) {
    updateCartItemDto.idUser = (updateCartItemDto.idUser) ? updateCartItemDto.idUser : user.id

    return this.natsClient.send('cart.update.item', updateCartItemDto).pipe(
      catchError((error) => {
        throw new RpcException(error)
      })
    )
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id', ParseIntPipe) idCartDetail: number) {
    return this.natsClient.send('cart.remove.item', idCartDetail).pipe(
      catchError((error) => {
        throw new RpcException(error)
      })
    )
  }
}
