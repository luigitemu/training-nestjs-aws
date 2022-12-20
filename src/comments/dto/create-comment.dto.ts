import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsObject, IsString, Min } from 'class-validator';
import { RequiredRoles } from '../../common/decorators/role-validator.decorator';
import { REQUEST_CONTEXT } from '../../common/constants/constants';
import { Roles } from '../../common/constants/enums';

export class CreateCommentDto {
  @ApiProperty({
    type: String,
    description: 'Comment of a File',
    minLength: 1,
    maxLength: 1000,
  })
  @IsString()
  @RequiredRoles({
    roles: [Roles.comments],
  })
  comment: string;

  @ApiProperty({
    type: Number,
    description: 'Id of the File',
  })
  @IsNumber()
  @Min(1)
  fileId: number;

  @IsObject()
  [REQUEST_CONTEXT]: unknown;
}
