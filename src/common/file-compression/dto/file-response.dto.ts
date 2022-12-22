import { Expose } from 'class-transformer';
import { FileType } from '../../../common/constants/enums';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FileResponseDto {
  @ApiProperty({
    example: 1,
    description: 'Id of the file',
    type: Number,
  })
  @Expose()
  @IsNumber()
  id: number;

  @ApiProperty({
    example: 'https://s3.amazonaws.com/your-bucket-name/your-object-key',
    description: 'Url of the file',
    type: String,
  })
  @Expose()
  @IsString()
  url: string;

  @ApiProperty({
    example: 'image',
    description: 'Type of the file',
  })
  @IsEnum(FileType)
  @Expose()
  fileType: FileType;

  @ApiProperty({
    example: 'png',
    description: 'Extension of the file',
    type: String,
  })
  @IsString()
  @Expose()
  extension: string;

  @ApiProperty({
    example: 'Description of the file',
    description: 'Description of the file',
    type: String,
  })
  @Expose()
  description: string | null;
}
