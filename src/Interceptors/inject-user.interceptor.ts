import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from 'src/auth/entities/user.entity';
import { REQUEST_CONTEXT } from '../common/constants/constants';

@Injectable()
export class InjectUserInterceptor implements NestInterceptor {
  constructor(private type?: 'query' | 'body' | 'params') {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    if (this.type && request[this.type]) {
      request[this.type][REQUEST_CONTEXT] = {
        user: request.user as User,
      };
    }

    return next.handle();
  }
}
