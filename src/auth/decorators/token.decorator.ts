import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';

export const Token = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    if(!request.token) {
      //* If user not found in request, It means an error by developer, that is why we use "InternalServerErrorException"
      throw new InternalServerErrorException('user not found in request (AuthGuard called?)')
    }

    return request.token;
  },
);