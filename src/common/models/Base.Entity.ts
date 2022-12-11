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
  Id?: number;

  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
    description: 'The date and time when the entity was created',
  })
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  CreateTime?: Date;

  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
    description: 'The date and time when the entity was last updated',
  })
  @UpdateDateColumn({ type: 'timestamp', nullable: true, default: null })
  UpdateTime?: Date;

  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
    description: 'The date and time when the entity was deleted',
  })
  @DeleteDateColumn({ type: 'timestamp', nullable: true, default: null })
  DeleteTime?: Date;
}
