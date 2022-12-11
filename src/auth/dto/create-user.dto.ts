import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

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
  FullName: string;

  @ApiProperty({
    type: String,
    description: 'Email of the User',
    example: 'mail@test.com',
  })
  @IsString()
  @IsEmail()
  Email: string;

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
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  Password: string;
}
