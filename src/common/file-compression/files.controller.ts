import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UnsupportedMediaTypeException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { FilesService } from './files.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '../dto/Pagination.dto';
import { InjectUserToQuery } from '../decorators/inject-user.decorator';
import { Auth } from 'src/auth/decorators';
import { Roles } from '../constants/enums';

// import * as ffmpeg from 'fluent-ffmpeg';
// import * as multer from 'multer';
// import * as zlib from 'zlib';

@ApiTags('Files - Get, Upload and Compression')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @ApiConsumes('multipart/form-data')
  @Auth(Roles.videos, Roles.images)
  @Post()
  @UseGuards(AuthGuard())
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/video|image/)) {
          cb(new UnsupportedMediaTypeException('Unsupported file type'), false);
        }
        cb(null, true);
      },
    }),
  )
  async compressVideo(
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: User,
  ) {
    const dataBuffer = file.buffer;
    const fileName = file.originalname;
    const fileType = file.mimetype.split('/')[0];
    return await this.filesService.uploadPublicFile(
      dataBuffer,
      fileName,
      user,
      fileType,
    );
  }

  @Get('images')
  @ApiResponse({
    status: 200,
    description: 'The images have been successfully retrieved.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @UseGuards(AuthGuard())
  async getImagesPaginated(@Query() paginationDto: PaginationDto) {
    return await this.filesService.getImagesPaginated(paginationDto);
  }

  @Get('videos')
  @ApiResponse({
    status: 200,
    description: 'The images have been successfully retrieved.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @UseGuards(AuthGuard())
  @InjectUserToQuery()
  async getVideosPaginated(@Query() paginationDto: PaginationDto) {
    return await this.filesService.getVideosPaginated(paginationDto);
  }

  @Get('one/:id')
  @ApiResponse({
    status: 200,
    description: 'The images have been successfully retrieved.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @UseGuards(AuthGuard())
  async getFile(@Param('id', ParseIntPipe) id: number) {
    return await this.filesService.getOne(id);
  }
}
