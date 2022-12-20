import { ApiProperty } from '@nestjs/swagger';
import { Comments } from '../../comments/entities/comments.entity';
import { Roles } from '../../common/constants/enums';
import { PublicFile } from '../../common/file-compression/entitites/file.entity';
import { BaseEntity } from '../../common/models/Base.Entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'Users' })
export class User extends BaseEntity {
  @ApiProperty({
    example: 'John Doe',
    description: 'Full Name of the User',
  })
  @Column({ type: 'text', nullable: false })
  fullName: string;

  @ApiProperty({
    example: 'mail@test.com',
    description: 'Email of the User',
    uniqueItems: true,
  })
  @Column({ type: 'text', nullable: false, unique: true })
  email: string;

  @ApiProperty({
    example: 'password',
    description: 'Password of the User',
  })
  @Column({ type: 'text', nullable: false, select: false })
  password: string;

  @ApiProperty({
    example: ['user', 'admin'],
    description: 'Roles of the User',
  })
  @Column('text', {
    array: true,
    default: [Roles.user],
  })
  roles: Roles[];

  @ApiProperty()
  @OneToMany(() => PublicFile, (file) => file.user)
  files: PublicFile[];

  @ApiProperty()
  @OneToMany(() => Comments, (comment) => comment.user)
  comments: Comments[];

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }
  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}
