import { applyDecorators, UseInterceptors, UsePipes } from '@nestjs/common';
import { InjectUserInterceptor } from '../../Interceptors/inject-user.interceptor';
import { StripRequestContextPipe } from '../../pipes/strip-request-context.pipe';

export const InjectUserToQuery = () => applyDecorators(InjectUserTo('query'));

export const InjectUserToBody = () => applyDecorators(InjectUserTo('body'));

export const InjectUserToParam = () => applyDecorators(InjectUserTo('params'));

export function InjectUserTo(context: 'query' | 'body' | 'params') {
  return applyDecorators(
    UseInterceptors(new InjectUserInterceptor(context)),
    UsePipes(StripRequestContextPipe),
  );
}
