import { BaseEntity } from 'src/common/models/Base.Entity';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';

@Entity({ name: 'Users' })
export class User extends BaseEntity {
  @Column({ type: 'text', nullable: false })
  FullName: string;

  @Column({ type: 'text', nullable: false, unique: true })
  Email: string;

  @Column({ type: 'text', nullable: false, select: false })
  Password: string;

  @Column('text', {
    array: true,
    default: ['user'],
  })
  Roles: string[];

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.Email = this.Email.toLowerCase().trim();
  }
  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}
