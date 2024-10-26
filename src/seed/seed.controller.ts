import { Controller, Get, Inject } from '@nestjs/common';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';

@Controller('seed')
export class SeedController {
  constructor(
    @Inject(NATS_SERVICE) private readonly natsClient: ClientProxy
  ) {}

  @Get('seed-execute')
  authCheckService() {
    return this.natsClient.send('seed.execute.secret', {}).pipe(
      catchError((error) => {
        throw new RpcException(error)
      })
    )
  }
}
