import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicFile } from './entitites/file.entity';
import { ConfigModule } from '@nestjs/config';
import { FilesController } from './files.controller';
import { AuthModule } from '../../auth/auth.module';

@Module({
  providers: [FilesService],
  imports: [TypeOrmModule.forFeature([PublicFile]), ConfigModule, AuthModule],
  controllers: [FilesController],
})
export class FilesModule {}
