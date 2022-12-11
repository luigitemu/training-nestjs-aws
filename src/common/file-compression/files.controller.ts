import {
  Controller,
  Post,
  UnsupportedMediaTypeException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { FilesService } from './files.service';
import { allowedFileTypesRegex } from '../constants/constants';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { ApiConsumes, ApiTags } from '@nestjs/swagger/dist';

@ApiTags('Files - Upload and Compression')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @ApiConsumes('multipart/form-data')
  @Post()
  @UseGuards(AuthGuard())
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, cb) => {
        console.log(file.mimetype);
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
    const fileName = file.originalname;
    const dataBuffer = file.buffer;

    return await this.filesService.uploadPublicFile(dataBuffer, fileName, user);
    // // return `https://s3.amazonaws.com/${process.env.AWS_BUCKET_NAME}/${key}`;
  }
}
