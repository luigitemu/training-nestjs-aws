import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { passwordRegex } from 'src/common/constants/constants';

export class LoginDto {
  @ApiProperty({
    type: String,
    description: 'Email of the User',
  })
  @IsString()
  @IsEmail()
  Email: string;

  @ApiProperty({
    type: String,
    description: 'Password of the User',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(passwordRegex, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  Password: string;
}
