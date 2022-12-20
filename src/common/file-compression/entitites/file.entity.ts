import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../../auth/entities/user.entity';
import { Comments } from '../../../comments/entities/comments.entity';
import { FileType } from '../../constants/enums';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../models/Base.Entity';

@Entity({ name: 'Files' })
export class PublicFile extends BaseEntity {
  @ApiProperty({
    example: 'www.google.com',
    description: 'Url of the File',
  })
  @Column({ type: 'text', nullable: false })
  url: string;

  @ApiProperty({
    example: 'key',
    description: 'Key of the File',
  })
  @Column({ type: 'text' })
  key: string;

  @Column({ type: 'enum', enum: FileType, nullable: true })
  fileType: FileType;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({
    example: '1',
    description: 'Id of the User',
  })
  @ManyToOne(() => User, (user) => user.files, {
    cascade: true,
    nullable: false,
  })
  user: User;

  @ApiProperty({
    example: 'Comments of the File',
    description: 'Comments of the File',
  })
  @OneToMany(() => Comments, (comment) => comment.file)
  comments: Comments[];
}
