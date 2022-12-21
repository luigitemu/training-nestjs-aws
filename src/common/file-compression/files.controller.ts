import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Res,
  UnsupportedMediaTypeException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { AuthGuard } from '@nestjs/passport';

import { GetUser } from '../../auth/decorators/get-user.decorator';
import { User } from '../../auth/entities/user.entity';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PaginationDto } from '../dto/Pagination.dto';
import { FilesService } from './files.service';
import { Auth } from '../../auth/decorators';
import { Roles } from '../constants/enums';
import { CreateFileDto } from './dto/create-file.dto';
import { InjectUserToBody } from '../decorators/inject-user.decorator';

@ApiTags('Files - Get, Upload and Compression')
@Controller('file')
@ApiBearerAuth()
@UseGuards(AuthGuard())
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        description: {
          type: 'string',
        },
      },
    },
  })
  @Auth(Roles.videos, Roles.images)
  @InjectUserToBody()
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
    @Body() createFileDto: CreateFileDto,
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: User,
  ) {
    if (!file) {
      throw new Error('No file uploaded');
    }
    const dataBuffer = file.buffer;
    const fileName = file.originalname;
    const fileType = file.mimetype.split('/')[0];
    const extension = file.mimetype.split('/')[1];
    return await this.filesService.uploadPublicFile(
      createFileDto,
      dataBuffer,
      fileName,
      user,
      fileType,
      extension,
    );
  }

  @Get()
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
  async getFilesPaginated(@Query() paginationDto: PaginationDto) {
    return await this.filesService.getFilesPaginated(paginationDto);
  }

  @Get(':id')
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
  async getFile(@Res() res, @Param('id', ParseIntPipe) id: number) {
    try {
      const { data, extension } = await this.filesService.findOne(id);

      res.contentType(data.ContentType);
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=${id}.${extension}`,
      );
      res.send(data.Body);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
}
