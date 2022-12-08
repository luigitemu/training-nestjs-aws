import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorator';
import {
  META_ROLES,
  RoleProtected,
} from './decorators/role-protected.decorator';
import { LoginDto, CreateUserDto } from './dto';
import { User } from './entities/user.entity';
import { UserRolGuard } from './guards/user-rol/user-rol.guard';
import { ValidRoles } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingRoute(@GetUser('Email') user: User) {
    return {
      ok: true,
      user,
    };
  }
  @Get('private2')
  @RoleProtected(ValidRoles.CanUploadVideos)
  @SetMetadata(META_ROLES, ['Admin'])
  @UseGuards(AuthGuard(), UserRolGuard)
  testingRoute2(@GetUser('Email') user: User) {
    return {
      ok: true,
      user,
    };
  }
}
