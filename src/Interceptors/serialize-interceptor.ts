import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { map, Observable } from 'rxjs';

export class SerializeInterceptor<D, T extends ClassConstructor<D>>
  implements NestInterceptor
{
  constructor(private dto: T) {}
  intercept(_context: ExecutionContext, handler: CallHandler): Observable<any> {
    return handler.handle().pipe(
      map((data: any) =>
        plainToClass(this.dto, data, {
          excludeExtraneousValues: true,
          enableCircularCheck: true,
        }),
      ),
    );
  }
}

export function Serialize<D>(dto: ClassConstructor<D>) {
  return UseInterceptors(new SerializeInterceptor(dto));
}
