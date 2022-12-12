import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/auth/entities/user.entity';
import { Comments } from 'src/comments/entities/comments.entity';
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
  Url: string;

  @ApiProperty({
    example: 'key',
    description: 'Key of the File',
  })
  @Column({ type: 'text' })
  Key: string;

  @Column({ type: 'enum', enum: FileType, nullable: true })
  FileType: FileType;

  @ApiProperty({
    example: '1',
    description: 'Id of the User',
  })
  @ManyToOne(() => User, (user) => user.Files, {
    cascade: true,
    nullable: false,
  })
  User: User;

  @ApiProperty({
    example: 'Comments of the File',
    description: 'Comments of the File',
  })
  @OneToMany(() => Comments, (comment) => comment.File)
  Comments: Comments[];
}
