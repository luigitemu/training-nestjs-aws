import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { S3 } from 'aws-sdk';
import * as ffmpeg from 'fluent-ffmpeg';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { PublicFile } from './entitites/file.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(PublicFile)
    private filesRepository: Repository<PublicFile>,
    private readonly configService: ConfigService,
  ) {}
  async compressFile(inputFile: Buffer, outputFile: string): Promise<void> {
    return new Promise((resolve, reject) => {
      ffmpeg();
    });
  }
  async uploadPublicFile(dataBuffer: Buffer, filename: string) {
    const s3 = new S3();
    const uploadResult = await s3
      .upload({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        Body: dataBuffer,
        Key: `${uuid()}-${filename}`,
      })
      .promise();

    const newFile = this.filesRepository.create({
      key: uploadResult.Key,
      url: uploadResult.Location,
    });
    await this.filesRepository.save(newFile);
    return newFile;
  }
}

// async uploadFileToS3(file: string, key: string): Promise<void> {
//   await this.s3
//     .upload({
//       Bucket: process.env.AWS_BUCKET_NAME,
//       Key: key,
//       Body: file,
//     })
//     .promise();
// }
// }
// import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { VideoCompressionService } from './video-compression.service';

// @Controller('videos')
// export class VideosController {
//   constructor(private readonly videoCompressionService: VideoCompressionService) {}

//   @Post()
//   @UseInterceptors(FileInterceptor('video'))
//   async compressVideo(@UploadedFile() video): Promise<string> {
//     const inputFile = video.path;
//     const outputFile = `compressed-${video.originalname}`;
//     await this.videoCompressionService.compressVideo(inputFile, outputFile);
//     const key = `compressed-videos/${outputFile}`;
//     await this.videoCompressionService.uploadFileToS3(outputFile, key);
//     return `https://s3.amazonaws.com/${process.env.AWS_BUCKET_NAME}/${key}`;
//   }
// }
