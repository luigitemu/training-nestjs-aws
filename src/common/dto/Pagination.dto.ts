import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  Min,
} from 'class-validator';
import { RequiredRoles } from 'src/common/decorators/role-validator.decorator';
import { REQUEST_CONTEXT } from '../constants/constants';

export class PaginationDto {
  @ApiProperty({
    type: Number,
    description: 'The number of items to return',
  })
  @IsNumber()
  @IsOptional()
  @IsPositive()
  @Min(1)
  take?: number;

  @ApiProperty({
    type: Number,
    description: 'The number of items to skip',
  })
  @IsNumber()
  @IsOptional()
  @IsPositive()
  @RequiredRoles()
  skip?: number;

  @IsObject()
  [REQUEST_CONTEXT]: any;
}
