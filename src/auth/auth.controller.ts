import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorator';
import {
  META_ROLES,
  RoleProtected,
} from './decorators/role-protected.decorator';
import { LoginDto, CreateUserDto } from './dto';
import { User } from './entities/user.entity';
import { UserRolGuard } from './guards/user-rol/user-rol.guard';
import { Roles } from '../common/constants/enums';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully logged in.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingRoute(@GetUser('email') email: string) {
    return {
      ok: true,
      email,
    };
  }
  @Get('private2')
  @RoleProtected(Roles.videos)
  @SetMetadata(META_ROLES, [Roles.videos])
  @UseGuards(AuthGuard(), UserRolGuard)
  testingRoute2(@GetUser('Email') user: User) {
    return {
      ok: true,
      user,
    };
  }
}
