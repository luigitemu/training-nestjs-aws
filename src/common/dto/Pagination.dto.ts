import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  Min,
} from 'class-validator';
import { RequiredRoles } from '../../common/decorators/role-validator.decorator';
import { REQUEST_CONTEXT } from '../constants/constants';
import { FileType } from '../constants/enums';

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

  @ApiProperty({
    type: FileType,
    description: 'The type of the file (image | video)',
    required: false,
  })
  @IsOptional()
  @IsEnum(FileType)
  type?: FileType;

  @IsObject()
  @IsOptional()
  [REQUEST_CONTEXT]: unknown;
}
