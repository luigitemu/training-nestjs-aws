import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../models/Base.Entity';

@Entity({ name: 'Files' })
export class PublicFile extends BaseEntity {
  @Column()
  public url: string;

  @Column()
  public key: string;
}
