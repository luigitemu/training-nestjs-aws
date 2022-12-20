import { ApiProperty } from '@nestjs/swagger';
import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the entity',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn()
  id?: number;

  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
    description: 'The date and time when the entity was created',
  })
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createTime?: Date;

  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
    description: 'The date and time when the entity was last updated',
  })
  @UpdateDateColumn({ type: 'timestamp', nullable: true, default: null })
  updateTime?: Date;

  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
    description: 'The date and time when the entity was deleted',
  })
  @DeleteDateColumn({ type: 'timestamp', nullable: true, default: null })
  deleteTime?: Date;
}
