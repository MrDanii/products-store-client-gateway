import { Body, Controller, Get, Inject, Param, Post, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { CreateUserDto, LoginUserDto } from './dto';
import { catchError } from 'rxjs';
import { AuthGuard } from './guard';
import { Token, User } from './decorators';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(NATS_SERVICE) private readonly natsClient: ClientProxy
  ) { }

  @Get('service-check')
  authCheckService() {
    return this.natsClient.send('auth.check1', {}).pipe(
      catchError((error) => {
        throw new RpcException(error)
      })
    )
  }

  @Post('register')
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.natsClient.send('auth.register.user', createUserDto).pipe(
      catchError((error) => {
        throw new RpcException(error)
      })
    )
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.natsClient.send('auth.login.user', loginUserDto).pipe(
      catchError((error) => {
        throw new RpcException(error)
      })
    )
  }

  @UseGuards(AuthGuard)
  @Get('verify')
  verifyToken(@User() user, @Token() token) {
    return {
      user,
      token
    }
  }
}
