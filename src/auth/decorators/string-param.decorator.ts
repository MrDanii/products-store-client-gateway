import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';

export const Term = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    if(!request.params.term) {
      throw new InternalServerErrorException('term not found in request')
    }

    return request.params.term;
  },
);