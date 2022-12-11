import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    type: String,
    description: 'Comment of a File',
    minLength: 1,
    maxLength: 1000,
  })
  @IsString()
  @Min(1)
  @Max(1000)
  Comment: string;

  @ApiProperty({
    type: Number,
    description: 'Id of the File',
  })
  @IsNumber()
  @Min(1)
  FileId: number;

  @ApiProperty({
    type: Number,
    description: 'Id of the User',
  })
  @IsNumber()
  @Min(1)
  UserId: number;
}
