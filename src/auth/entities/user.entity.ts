import { ApiProperty } from '@nestjs/swagger';
import { Comments } from 'src/comments/entities/comments.entity';
import { Roles } from 'src/common/constants/enums';
import { PublicFile } from 'src/common/file-compression/entitites/file.entity';
import { BaseEntity } from 'src/common/models/Base.Entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'Users' })
export class User extends BaseEntity {
  @ApiProperty({
    example: 'John Doe',
    description: 'Full Name of the User',
  })
  @Column({ type: 'text', nullable: false })
  FullName: string;

  @ApiProperty({
    example: 'mail@test.com',
    description: 'Email of the User',
    uniqueItems: true,
  })
  @Column({ type: 'text', nullable: false, unique: true })
  Email: string;

  @ApiProperty({
    example: 'password',
    description: 'Password of the User',
  })
  @Column({ type: 'text', nullable: false, select: false })
  Password: string;

  @ApiProperty({
    example: ['user', 'admin'],
    description: 'Roles of the User',
  })
  @Column('text', {
    array: true,
    default: [Roles.user],
  })
  Roles: Roles[];

  @ApiProperty()
  @OneToMany(() => PublicFile, (file) => file.User)
  Files: PublicFile[];

  @ApiProperty()
  @OneToMany(() => Comments, (comment) => comment.User)
  Comments: Comments[];

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.Email = this.Email.toLowerCase().trim();
  }
  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}
