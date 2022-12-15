import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
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
    required: false,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @IsPositive()
  @Min(1)
  take?: number;

  @ApiProperty({
    type: Number,
    description: 'The number of items to skip',
    required: false,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @IsPositive()
  @RequiredRoles()
  skip?: number;

  @IsObject()
  @IsOptional()
  [REQUEST_CONTEXT]: unknown;
}
