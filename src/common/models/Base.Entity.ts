import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  Id?: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  CreateTime?: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true, default: null })
  UpdateTime?: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true, default: null })
  DeleteTime?: Date;
}
