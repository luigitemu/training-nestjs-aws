import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../common/models/Base.Entity';
import { PublicFile } from '../../common/file-compression/entitites/file.entity';
import { User } from '../../auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger/dist';

@Entity({ name: 'Comments' })
export class Comments extends BaseEntity {
  @ApiProperty({
    example: 'This is a comment',
    description: 'Comment of a File',
  })
  @Column({ type: 'text', nullable: false })
  comment: string;

  @ApiProperty({
    example: '1',
    description: 'Id of the User',
  })
  @ManyToOne(() => User, (user) => user.comments, {
    cascade: true,
    nullable: false,
  })
  user: User;

  @ApiProperty({
    example: '1',
    description: 'Id of the File',
  })
  @ManyToOne(() => PublicFile, (file) => file.comments, {
    cascade: true,
    nullable: false,
  })
  file: PublicFile;
}
