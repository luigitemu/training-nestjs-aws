import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDatabase1671122751856 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // create table
    await queryRunner.createDatabase('training', true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropDatabase('training', true);
  }
}
