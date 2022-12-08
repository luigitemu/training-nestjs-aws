import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { Password, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        Password: await bcrypt.hashSync(Password, 10),
      });
      await this.userRepository.save(user);
      delete user.Password;
      return {
        ...user,
        token: this.getJwtToken({ Id: user.Id }),
      };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async login(loginDto: LoginDto) {
    const { Email, Password } = loginDto;

    const user = await this.userRepository.findOne({
      where: {
        Email,
      },
      select: ['Id', 'Email', 'FullName', 'Password'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!bcrypt.compareSync(Password, user.Password)) {
      throw new UnauthorizedException('Invalid credentials');
    }
    delete user.Password;

    return {
      ...user,
      token: this.getJwtToken({ Id: user.Id }),
    };
  }

  private getJwtToken(payload: JwtPayload): string {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    throw new InternalServerErrorException(error.message);
  }
}
