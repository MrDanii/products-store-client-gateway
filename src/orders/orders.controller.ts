import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Query, ParseUUIDPipe } from '@nestjs/common';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { CreateOrderDto, StatusDto, UpdateOrderDto } from './dto';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { OrderStatus } from './enum/order.enum';

@Controller('orders')
export class OrdersController {
  constructor(@Inject(NATS_SERVICE) private readonly natsClient: ClientProxy) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.natsClient.send('order.create', createOrderDto).pipe(
      catchError((error) => {
        throw new RpcException(error)
      })
    )
    // return this.ordersService.create(createOrderDto);
  }

  @Get()
  findAll(@Query() orderPaginationDto: OrderPaginationDto) {
    return this.natsClient.send('order.find.all', orderPaginationDto).pipe(
      catchError((error) => {
        throw new RpcException(error)
      })
    )
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.natsClient.send('order.find.one', id).pipe(
      catchError((error) => {
        throw new RpcException(error)
      })
    )
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) idOrder: string , @Body() orderStatus: StatusDto) {
    return this.natsClient.send('order.update.status', {idOrder, orderStatus: orderStatus.orderStatus}).pipe(
      catchError((error) => {
        throw new RpcException(error)
      })
    )
    // return this.ordersService.update(+id, updateOrderDto);
  }
}
