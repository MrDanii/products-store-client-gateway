import { Body, Controller, Get, Inject, Param, ParseUUIDPipe, Patch, Query, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { ToggleActiveUserDto, UpdateUserAdminDto, UpdateUserDto, UserPaginationDto } from './dto';
import { AuthGuard } from 'src/auth/guard';
import { RoleProtected, User } from 'src/auth/decorators';
import { UserJwtDto } from 'src/common';
import { catchError } from 'rxjs';
import { UserRoleGuard } from 'src/auth/guard/user-role.guard';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';

@Controller('user-edit')
export class UserEditController {
  constructor(
    @Inject(NATS_SERVICE) private readonly natsClient: ClientProxy
  ) { }

  @Get()
  @UseGuards(AuthGuard, UserRoleGuard)
  @RoleProtected(ValidRoles.admin)    // only aadmin can watch list of users
  findAllUsers(@Query() userPaginationDto: UserPaginationDto) {    
    return this.natsClient.send('user.find.all', userPaginationDto).pipe(
      catchError((error) => {
        throw new RpcException(error)
      })
    )
  }

  @Get(':idUser')
  @UseGuards(AuthGuard)
  findUser(@Param('idUser', ParseUUIDPipe) idUser: string) {    
    return this.natsClient.send('user.find.one', idUser).pipe(
      catchError((error) => {
        throw new RpcException(error)
      })
    )
  }

  @Patch()
  @UseGuards(AuthGuard)
  updateSelfUserInfo(@Body() updateUserDto: UpdateUserDto, @User() user: UserJwtDto) {
    updateUserDto.idUser = (updateUserDto.idUser) ? updateUserDto.idUser : user.id

    return this.natsClient.send('user.update.self', updateUserDto).pipe(
      catchError((error) => {
        throw new RpcException(error)
      })
    )
  }

  @Patch('admin-update')
  @UseGuards(AuthGuard, UserRoleGuard)
  @RoleProtected(ValidRoles.admin)
  updateUserFromAdmin(@Body() updateUserAdminDto: UpdateUserAdminDto, @User() user: UserJwtDto) {
    updateUserAdminDto.updatedBy = user.userNickName

    return this.natsClient.send('user.update.one', updateUserAdminDto).pipe(
      catchError((error) => {
        throw new RpcException(error)
      })
    )
  }

  @Patch('toggle-active/:idUser')
  @UseGuards(AuthGuard, UserRoleGuard)
  @RoleProtected(ValidRoles.admin)
  toggleActiveUser(@Param('idUser', ParseUUIDPipe) idUserToToggle: string, @User() user: UserJwtDto) {
    const payload: ToggleActiveUserDto = {
      idUserToToggle: idUserToToggle,
      userWhoUpdated: user.userNickName
    }

    return this.natsClient.send('user.toggle.active', payload).pipe(
      catchError((error) => {
        throw new RpcException(error)
      })
    )
  }
}
