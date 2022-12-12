import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

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
  skip?: number;
}
