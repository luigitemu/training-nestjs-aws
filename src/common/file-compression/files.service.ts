import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { S3 } from 'aws-sdk';
import * as ffmpeg from 'fluent-ffmpeg';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { PublicFile } from './entitites/file.entity';
import { FileType } from '../constants/enums';
import { PaginationDto } from '../dto/Pagination.dto';
import { urlSignedExpiredTime } from '../constants/constants';

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
  async uploadPublicFile(
    dataBuffer: Buffer,
    filename: string,
    user: User,
    fileType: string,
  ) {
    const s3 = new S3();
    const uploadResult = await s3
      .upload({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        Body: dataBuffer,
        Key: `${uuid()}-${filename}`,
      })
      .promise();

    const newFile = this.filesRepository.create({
      Key: uploadResult.Key,
      Url: uploadResult.Location,
      User: user,
      FileType: fileType as FileType,
    });
    await this.filesRepository.save(newFile);
    return newFile;
  }

  async getImagesPaginated(paginationDto: PaginationDto) {
    const { skip = 0, take = 5 } = paginationDto;
    const images = await this.filesRepository.find({
      where: {
        FileType: FileType.image,
      },
      skip,
      take,
    });

    return this.getSignedUrls(images);
  }
  async getVideosPaginated(paginationDto: PaginationDto) {
    const { skip = 0, take = 5 } = paginationDto;
    const videos = await this.filesRepository.find({
      where: {
        FileType: FileType.video,
      },
      skip,
      take,
    });

    return this.getSignedUrls(videos);
  }

  async getOne(id: number) {
    const file = await this.filesRepository.findOne({
      where: {
        Id: id,
      },
      relations: ['Comments'],
    });

    if (!file) throw new NotFoundException('File not found');

    return {
      url: this.getSignedUrls([file]),
      type: file.FileType,
      comments: file.Comments,
    };
  }

  private async getSignedUrls(files: PublicFile[]) {
    const s3 = new S3({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
    });

    const s3Bucket = this.configService.get('AWS_PUBLIC_BUCKET_NAME');

    const keys = files.map((file) => file.Key);
    const urls = await Promise.all(
      keys.map(async (key) => ({
        url: s3.getSignedUrl('getObject', {
          Bucket: s3Bucket,
          Key: key,
          Expires: urlSignedExpiredTime,
        }),
      })),
    );

    return urls;
  }
}
