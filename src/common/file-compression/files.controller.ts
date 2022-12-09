import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { FilesService } from './files.service';
import { allowedFileTypesRegex } from '../constants/constants';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(allowedFileTypesRegex)) {
          cb(new BadRequestException('Unsupported file type'), false);
        }
        cb(null, true);
      },
    }),
  )
  async compressVideo(@UploadedFile() file: Express.Multer.File) {
    const fileName = file.originalname;
    const dataBuffer = file.buffer;

    return await this.filesService.uploadPublicFile(dataBuffer, fileName);
    // // return `https://s3.amazonaws.com/${process.env.AWS_BUCKET_NAME}/${key}`;
  }
}
