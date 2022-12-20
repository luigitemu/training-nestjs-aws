import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
  IsArray,
  IsOptional,
} from 'class-validator';
import { passwordRegex } from '../../common/constants/constants';
import { Roles } from '../../common/constants/enums';

export class CreateUserDto {
  @ApiProperty({
    type: String,
    description: 'Full Name of the User',
    minLength: 3,
    maxLength: 200,
    example: 'John Doe',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  fullName: string;

  @ApiProperty({
    type: String,
    description: 'Email of the User',
    example: 'mail@test.com',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    description: 'Password of the User',
    minLength: 6,
    maxLength: 50,
    example: 'Password123',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(passwordRegex, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @ApiProperty({
    type: [String],
    description: 'Roles of the User',
  })
  @IsOptional()
  @IsArray()
  roles?: Roles[];
}
