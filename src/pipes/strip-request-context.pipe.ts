import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { omit } from 'lodash';

import { REQUEST_CONTEXT } from '../common/constants/constants';

@Injectable()
export class StripRequestContextPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    return omit(value, REQUEST_CONTEXT);
  }
}
