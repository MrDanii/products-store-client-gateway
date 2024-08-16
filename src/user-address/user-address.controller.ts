import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Inject, Query } from '@nestjs/common';
import { CreateUserAddressDto } from './dto/create-user-address.dto';
import { UpdateUserAddressDto } from './dto/update-user-address.dto';
import { AuthGuard } from 'src/auth/guard';
import { User } from 'src/auth/decorators';
import { PaginationDto, UserJwtDto } from 'src/common';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { FindAddressDto, RemoveAddressDto, UserAddressesPaginatioDto } from './dto';

@Controller('user-address')
export class UserAddressController {
  constructor(
    @Inject(NATS_SERVICE) private readonly natsClient: ClientProxy
  ) { }

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createUserAddressDto: CreateUserAddressDto, @User() user: UserJwtDto) {
    createUserAddressDto.idUser = (createUserAddressDto.idUser) ? (createUserAddressDto.idUser) : user.id

    return this.natsClient.send('address.user.create', createUserAddressDto).pipe(
      catchError((error) => {
        throw new RpcException(error)
      })
    )
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@User() user: UserJwtDto, @Query() paginationDto: PaginationDto) {
    const { page, limit } = paginationDto
    const { id: idUser } = user
    const userAddressesPaginatioDto: UserAddressesPaginatioDto = { idUser, limit, page }

    return this.natsClient.send('address.user.find.many', userAddressesPaginatioDto).pipe(
      catchError((error) => {
        throw new RpcException(error)
      })
    )
  }

  @Get(':idAddress')
  @UseGuards(AuthGuard)
  findOne(@Param('idAddress') idAddress: string, @User() user: UserJwtDto) {
    const findAddressDto: FindAddressDto = { idUserAddress: idAddress, idUser: user.id }

    return this.natsClient.send('address.user.find.one', findAddressDto).pipe(
      catchError((error) => {
        throw new RpcException(error)
      })
    )
  }

  @Patch(':idAddress')
  @UseGuards(AuthGuard)
  update(@Param('idAddress') id: string, @Body() updateUserAddressDto: UpdateUserAddressDto, @User() user: UserJwtDto) {
    updateUserAddressDto.idUserAddress = id
    updateUserAddressDto.idUser = user.id

    return this.natsClient.send('address.update', updateUserAddressDto).pipe(
      catchError((error) => {
        throw new RpcException(error)
      })
    )
  }

  @Delete(':idUserAddress')
  @UseGuards(AuthGuard)
  remove(@Param('idUserAddress') idUserAddress: string, @User() user: UserJwtDto) {
    const removeAddressDto: RemoveAddressDto = {idUserAddress, userIdUser: user.id}

    return this.natsClient.send('address.remove.one', removeAddressDto).pipe(
      catchError((error) => {
        throw new RpcException(error)
      })
    )
  }
}
