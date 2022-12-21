import { IsOptional, IsString } from 'class-validator';
import { RequiredRoles } from '../../decorators/role-validator.decorator';
import { Roles } from '../../../common/constants/enums';
import { REQUEST_CONTEXT } from '../../constants/constants';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFileDto {
  @ApiProperty({
    type: String,
    description: 'Description of the File',
    minLength: 1,
    maxLength: 1000,
  })
  @IsString()
  @IsOptional()
  @RequiredRoles({
    roles: [Roles.comments],
  })
  description?: string;

  @IsOptional()
  [REQUEST_CONTEXT]?: unknown;
}
