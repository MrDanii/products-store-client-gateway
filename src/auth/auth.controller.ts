import { BadRequestException, Body, Controller, Get, Inject, Param, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { CreateUserDto, LoginUserDto } from './dto';
import { catchError } from 'rxjs';
import { RoleProtected, Token, User } from './decorators';
import { AuthGuard } from './guard';
import { AuthGuard as AuthGuardGoogle } from '@nestjs/passport';
import { UserRoleGuard } from './guard/user-role.guard';
import { ValidRoles } from './interfaces/valid-roles';

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

  @Get('verify')
  @UseGuards(AuthGuard)
  verifyToken(@User() user, @Token() token) {
    return {
      user,
      token
    }
  }

  @Get('testing-auth-roles')
  @RoleProtected(ValidRoles.user)
  @UseGuards(AuthGuard, UserRoleGuard)
  // @UseGuards(UserRoleGuard)
  testingAuthRoles() {
    return {
      status: 200,
      message: 'Success !!'
    }
  }

  @Get('google-auth')
  @UseGuards(AuthGuardGoogle('google'))
  async googleAuth(@Req() req) {
  }

  @Get('google-redirect')
  @UseGuards(AuthGuardGoogle('google'))
  async googleAuthRedirect(@Req() req) {    
    if(!req.user) {
      throw new BadRequestException('No Google User found')
    }

    return this.natsClient.send('auth.google.redirect', req.user).pipe(
      catchError((error) => {
        throw new RpcException(error)
      })
    )
  }
}
