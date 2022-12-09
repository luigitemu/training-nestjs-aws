import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicFile } from './entitites/file.entity';
import { ConfigModule } from '@nestjs/config';
import { FilesController } from './files.controller';

@Module({
  providers: [FilesService],
  imports: [TypeOrmModule.forFeature([PublicFile]), ConfigModule],
  controllers: [FilesController],
})
export class FilesModule {}
