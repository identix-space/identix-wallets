import {MigrationInterface, QueryRunner} from "typeorm";

export class AddValueToWeb2MethodsType1664275795554 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TYPE "web2_auth_methods" ADD VALUE 'evmAddress' AFTER 'telegram'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }
}
