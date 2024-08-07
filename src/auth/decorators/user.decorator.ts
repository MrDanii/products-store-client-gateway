import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    if(!request.user) {
      //* If user not found in request, It means an error by developer, that is why we use "InternalServerErrorException"
      throw new InternalServerErrorException('user not found in request (AuthGuard called?)')
    }

    return request.user;
  },
);