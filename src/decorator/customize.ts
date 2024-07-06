import { ExecutionContext, SetMetadata, createParamDecorator } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const User = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);

export const RESPONSE_MESAGE = 'response_message'
export const ResponseMessage = (message: string) =>
    SetMetadata(RESPONSE_MESAGE, message);