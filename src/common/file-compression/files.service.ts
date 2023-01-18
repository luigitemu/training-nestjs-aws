import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { S3 } from 'aws-sdk';
import { User } from '../../auth/entities/user.entity';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { PublicFile } from './entitites/file.entity';
import { FileType } from '../constants/enums';
import { PaginationDto } from '../dto/Pagination.dto';
import { urlSignedExpiredTime } from '../constants/constants';
import { CreateFileDto } from './dto/create-file.dto';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(PublicFile)
    private filesRepository: Repository<PublicFile>,
    private readonly configService: ConfigService,
  ) {}

  async uploadPublicFile(
    createFileDto: CreateFileDto,
    dataBuffer: Buffer,
    filename: string,
    user: User,
    fileType: string,
    extension: string,
  ) {
    const { description } = createFileDto;
    const s3 = new S3();
    const uploadResult = await s3
      .upload({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        Body: dataBuffer,
        Key: `${uuid()}-${filename}`,
      })
      .promise();

    const newFile = this.filesRepository.create({
      description,
      key: uploadResult.Key,
      url: uploadResult.Location,
      user: user,
      fileType: fileType as FileType,
      extension,
    });
    await this.filesRepository.save(newFile);
    return newFile;
  }

  async getFilesPaginated(paginationDto: PaginationDto) {
    const { skip = 0, take = 5, type = FileType.video } = paginationDto;
    const images = await this.filesRepository.find({
      where: {
        fileType: type,
      },
      skip,
      take,
    });

    return this.getSignedUrls(images);
  }

  async findOne(id: number) {
    try {
      const file = await this.filesRepository.findOne({
        where: {
          id,
        },
        relations: ['comments'],
      });

      if (!file) throw new NotFoundException('File not found');
      // get the file from s3 and return it
      const s3 = new S3({
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      });
      const s3Bucket = this.configService.get('AWS_PUBLIC_BUCKET_NAME');

      const fileStream = s3
        .getObject({
          Bucket: s3Bucket,
          Key: file.key,
        })
        .promise();

      return { data: await fileStream, extension: file.extension };
    } catch (error) {
      throw new NotFoundException('File not found');
    }
  }

  private async getSignedUrls(files: PublicFile[]) {
    const s3 = new S3({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
    });

    const s3Bucket = this.configService.get('AWS_PUBLIC_BUCKET_NAME');
    const urls = await Promise.all(
      files.map(async (file) => ({
        url: s3.getSignedUrl('getObject', {
          Bucket: s3Bucket,
          Key: file.key,
          Expires: urlSignedExpiredTime,
        }),
        ...file,
      })),
    );

    return urls;
  }
}
