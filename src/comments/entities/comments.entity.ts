import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../common/models/Base.Entity';
import { PublicFile } from 'src/common/file-compression/entitites/file.entity';
import { User } from 'src/auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger/dist';

@Entity({ name: 'Comments' })
export class Comments extends BaseEntity {
  @ApiProperty({
    example: 'This is a comment',
    description: 'Comment of a File',
  })
  @Column({ type: 'text', nullable: false })
  Comment: string;

  @ApiProperty({
    example: '1',
    description: 'Id of the User',
  })
  @ManyToOne(() => User, (user) => user.Comments, {
    cascade: true,
    nullable: false,
  })
  User: User;

  @ApiProperty({
    example: '1',
    description: 'Id of the File',
  })
  @ManyToOne(() => PublicFile, (file) => file.Comments, {
    cascade: true,
    nullable: false,
  })
  File: PublicFile;
}
