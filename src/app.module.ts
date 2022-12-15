import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { FilesModule } from './common/file-compression/files.module';
import { CommentsModule } from './comments/comments.module';
import { MulterModule } from '@nestjs/platform-express';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.TYPEORM_HOST,
      port: parseInt(process.env.TYPEORM_PORT),
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
      migrations: ['dist/src/migrations/*{.ts,.js}'],
      migrationsTableName: 'migrations_history',
      // migrationsRun: true,
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
    }),

    AuthModule,

    MulterModule.register({
      dest: './temp',
    }),

    FilesModule,

    CommentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
