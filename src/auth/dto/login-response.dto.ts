import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber, IsEmail, IsString } from 'class-validator';

export class LoginResponseDto {
  @ApiProperty({
    type: Number,
    description: 'Id of the User',
    minimum: 1,
  })
  @Expose()
  @IsNumber()
  id: number;

  @ApiProperty({
    type: String,
    description: 'Full Name of the User',
  })
  @Expose()
  fullName: string;

  @ApiProperty({
    type: String,
    description: 'Email of the User',
  })
  @Expose()
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    description: 'Token of the User',
  })
  @Expose()
  @IsString()
  token: string;
}
